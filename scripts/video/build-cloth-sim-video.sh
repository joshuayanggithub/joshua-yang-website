#!/bin/bash
# Builds public/media/demos/cloth-folding-sim.mp4: simulated cloth-folding trajectories
# at 10x speed, shown as 1 -> 2x2 -> 3x3 (each segment plays a full trajectory).
#
# Needs: macOS usdrecord (/usr/bin/usdrecord), ffmpeg, and a Python with `usd-core`
#   python3.11 -m venv .usdenv && .usdenv/bin/pip install usd-core
#   USD_PYTHON=.usdenv/bin/python scripts/video/build-cloth-sim-video.sh
# Options: LABEL=1 stamps each tile with its filename (needs pillow); REUSE=1 keeps
# frame sequences already rendered in $WORK. See also review-trajectories.sh.
#
# The source .usd files are never modified: make_wrap.py writes a small .usda per
# trajectory that sublayers the original and adds a camera, sane lights (the files
# author exposure 9-10, which clips to white), colours, and turns off instancing on
# directly-instanced gprims (usdrecord's Metal renderer skips those).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="${SRC:-$HOME/Documents/policies/success}"
WORK="${WORK:-${TMPDIR:-/tmp}/cloth-sim-video}"
OUT="${OUT:-$HERE/../../public/media/demos/cloth-folding-sim.mp4}"
PY="${USD_PYTHON:-python3}"
EYE="0,5.7,-9.9"; TARGET="0,0.8,-0.1" # camera position / look-at (metres, Y up); -Z is the front,
                                        # far enough back that the widest start poses (e.g. 83) stay in frame,
                                        # where the garment reads collar-away like the Newton viewer
STRIDE=10                              # 60fps source, 60fps output -> 10x speed
FPS=60
W=1800; H=1200                         # canvas; divisible by 2 and 3 so tiles are whole pixels
BG=0x222222

# Trajectories by file name (without .usd), in tile order.
P=example_robot_manipulating_cloth_heuristic
SINGLE=(${P}83)
QUAD=(${P}_ds1_12 ${P}12 ${P}107 ${P}_ds1_51)
NINE=(${P}22 ${P}42 ${P}49 ${P}64 ${P}80 ${P}102 folding_7 ${P}_ds1_2 ${P}_ds1_35)

mkdir -p "$WORK/wrap" "$WORK/seg"
TILE_W=900   # grid tiles are rendered once at this width and scaled to fit (shares $WORK with review-trajectories.sh)
render() { # name width dir
  local name=$1 w=$2 dir=$3
  if [ "${REUSE:-0}" = 1 ] && [ -f "$dir/n_0000.png" ]; then echo "reuse  $name @${w}px"; return; fi
  rm -rf "$dir"; mkdir -p "$dir"
  "$PY" "$HERE/make_wrap.py" "$SRC/$name.usd" "$WORK/wrap/$name.usda" "$EYE" "$TARGET" >/dev/null 2>&1
  usdrecord --camera RenderCam --complexity high --frames 0:4840x$STRIDE --imageWidth "$w" "$WORK/wrap/$name.usda" "$dir/f_#####.png" >/dev/null 2>&1
  local i=0   # usdrecord names frames by time code; renumber for ffmpeg
  for f in $(ls "$dir" | sort -t_ -k2 -n); do mv "$dir/$f" "$dir/$(printf 'n_%04d.png' $i)"; i=$((i+1)); done
  echo "render $name ($i frames @ ${w}px)"
}
segment() { # out cols tileW tileH seqRoot names...
  local out=$1 cols=$2 tw=$3 th=$4 root=$5; shift 5
  local inputs=() fc="" labels="" layout="" i=0 in=0
  for n in "$@"; do
    inputs+=(-framerate $FPS -i "$root/$n/n_%04d.png")
    fc+="color=c=$BG:s=${tw}x${th}:r=$FPS[bg$i];[$in:v]scale=$tw:$th:flags=lanczos[sc$i];[bg$i][sc$i]overlay=shortest=1:format=auto[t$i];"; in=$((in+1))
    if [ "${LABEL:-0}" = 1 ]; then   # filename in the tile's top-left corner (for reviewing trajectories)
      mkdir -p "$WORK/lbl"
      "$PY" "$HERE/make_label.py" "$n.usd" "$WORK/lbl/$n-$tw.png" $(( tw / 75 + 6 )) >/dev/null 2>&1
      inputs+=(-loop 1 -framerate $FPS -i "$WORK/lbl/$n-$tw.png")
      fc+="[t$i][$in:v]overlay=10:10:shortest=1[l$i];"; in=$((in+1)); labels+="[l$i]"
    else labels+="[t$i]"; fi
    layout+="$(( (i % cols) * tw ))_$(( (i / cols) * th ))|"; i=$((i+1))
  done
  if [ $i -eq 1 ]; then fc+="${labels}eq=saturation=1.5,format=yuv420p[v]"
  else fc+="${labels}xstack=inputs=$i:layout=${layout%|}[g];[g]eq=saturation=1.5,format=yuv420p[v]"; fi
  ffmpeg -v error -y "${inputs[@]}" -filter_complex "$fc" -map "[v]" -c:v libx264 -crf 12 -preset fast "$out"
}

mkdir -p "$WORK/seq" "$WORK/seq_full"
for n in "${SINGLE[@]}"; do render "$n" $W "$WORK/seq_full/$n"; done
for n in "${QUAD[@]}" "${NINE[@]}"; do render "$n" $TILE_W "$WORK/seq/$n"; done
segment "$WORK/seg/a.mp4" 1 $W $H "$WORK/seq_full" "${SINGLE[@]}"
segment "$WORK/seg/b.mp4" 2 $((W/2)) $((H/2)) "$WORK/seq" "${QUAD[@]}"
segment "$WORK/seg/c.mp4" 3 $((W/3)) $((H/3)) "$WORK/seq" "${NINE[@]}"
# each segment is 8.08s (485 frames); 0.5s crossfades between them
ffmpeg -v error -y -i "$WORK/seg/a.mp4" -i "$WORK/seg/b.mp4" -i "$WORK/seg/c.mp4" -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=7.58[ab];[ab][2:v]xfade=transition=fade:duration=0.5:offset=15.16,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -crf 19 -preset slow -movflags +faststart -an "$OUT"
echo "wrote $OUT"
