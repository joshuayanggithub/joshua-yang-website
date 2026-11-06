#!/bin/bash
# Review video for weeding out bad trajectories: EVERY .usd in $SRC at 10x speed, four
# per screen (2x2), each tile labelled with its filename. Pages are hard-cut together.
#
#   USD_PYTHON=.usdenv/bin/python scripts/video/review-trajectories.sh
# Needs usdrecord, ffmpeg, and a Python with usd-core + pillow. Set REUSE=1 to keep
# already-rendered frame sequences in $WORK.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="${SRC:-$HOME/Documents/policies/success}"
WORK="${WORK:-${TMPDIR:-/tmp}/cloth-sim-review}"
OUT="${OUT:-$HOME/Documents/policies/cloth-sim-review.mp4}"
PY="${USD_PYTHON:-python3}"
EYE="0,5.7,-9.9"; TARGET="0,0.8,-0.1"
STRIDE=10; FPS=60; TW=900; TH=600; BG=0x222222

mkdir -p "$WORK/wrap" "$WORK/seq" "$WORK/lbl" "$WORK/page"
FILES=(); while IFS= read -r f; do FILES+=("$f"); done < <(ls "$SRC"/*.usd | sort -V)
echo "${#FILES[@]} trajectories"

for f in "${FILES[@]}"; do
  name="$(basename "$f" .usd)"; dir="$WORK/seq/$name"
  "$PY" "$HERE/make_label.py" "$name.usd" "$WORK/lbl/$name.png" 15 >/dev/null 2>&1
  if [ "${REUSE:-0}" = 1 ] && [ -f "$dir/n_0000.png" ]; then echo "reuse  $name"; continue; fi
  rm -rf "$dir"; mkdir -p "$dir"
  "$PY" "$HERE/make_wrap.py" "$f" "$WORK/wrap/$name.usda" "$EYE" "$TARGET" >/dev/null 2>&1
  usdrecord --camera RenderCam --complexity high --frames 0:4840x$STRIDE --imageWidth $TW "$WORK/wrap/$name.usda" "$dir/f_#####.png" >/dev/null 2>&1
  i=0; for p in $(ls "$dir" | sort -t_ -k2 -n); do mv "$dir/$p" "$dir/$(printf 'n_%04d.png' $i)"; i=$((i+1)); done
  echo "render $name ($i frames)"
done

page=0; : > "$WORK/pages.txt"
for ((s = 0; s < ${#FILES[@]}; s += 4)); do
  inputs=(); fc=""; labels=""; layout=""; i=0
  for f in "${FILES[@]:s:4}"; do
    name="$(basename "$f" .usd)"
    inputs+=(-framerate $FPS -i "$WORK/seq/$name/n_%04d.png" -loop 1 -framerate $FPS -i "$WORK/lbl/$name.png")
    fc+="color=c=$BG:s=${TW}x${TH}:r=$FPS[bg$i];[bg$i][$((2*i)):v]overlay=shortest=1:format=auto[s$i];[s$i][$((2*i+1)):v]overlay=12:12:shortest=1[t$i];"
    labels+="[t$i]"; layout+="$(( (i % 2) * TW ))_$(( (i / 2) * TH ))|"; i=$((i+1))
  done
  while [ $i -lt 4 ]; do   # pad the last page with empty tiles
    fc+="color=c=$BG:s=${TW}x${TH}:r=$FPS:d=8.0834[t$i];"; labels+="[t$i]"; layout+="$(( (i % 2) * TW ))_$(( (i / 2) * TH ))|"; i=$((i+1))
  done
  fc+="${labels}xstack=inputs=4:layout=${layout%|}:shortest=1[g];[g]eq=saturation=1.5,format=yuv420p[v]"
  ffmpeg -v error -y "${inputs[@]}" -filter_complex "$fc" -map "[v]" -c:v libx264 -crf 20 -preset medium "$WORK/page/p$page.mp4"
  echo "file '$WORK/page/p$page.mp4'" >> "$WORK/pages.txt"; echo "page $page done"; page=$((page+1))
done
ffmpeg -v error -y -f concat -safe 0 -i "$WORK/pages.txt" -c copy -movflags +faststart "$OUT"
echo "wrote $OUT"
