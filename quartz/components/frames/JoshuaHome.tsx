/**
 * The site homepage — a port of joshua-yang-website's src/pages/index.astro (about +
 * projects with the selected/all filter). Same markup and class names, so
 * new-styles.css + pi-theme.css style it and new-script.js drives the filter, the
 * "last updated" date and the visitor map, exactly as on the Astro site.
 *
 * Projects are data: add, remove or reorder entries in PROJECTS below.
 */
import { JSX } from "preact"

const SITE = "/static/site"
const DEMOS = `${SITE}/media/demos`

type Project = {
  /** shown top-right of the card; leave empty to continue the previous year's group */
  year?: string
  title: string
  /** plain text, or JSX when it needs inline links */
  description: string | JSX.Element
  media: { kind: "video" | "image"; src: string; alt?: string }
  links?: { label: string; href: string }[]
  /** appears under the "selected" filter (the default view); drawn in pi's soft box */
  selected?: boolean
  /** the flagship: pi's strong black box with the hard shadow. Unselected work gets no box. */
  featured?: boolean
  /** handwritten-style margin note beside the card */
  annotation?: string
}

/** external link inside a description */
const Ext = ({ href, children }: { href: string; children: string }) => (
  <a href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
)

const PROJECTS: Project[] = [
  {
    year: "2026",
    title: "CoinRun World Model",
    description: (
      <>
        Built a training pipeline for a world model of the 2D platformer CoinRun (an RL benchmark). I downsized{" "}
        <Ext href="https://oasis-model.github.io/">Oasis</Ext>'s Minecraft world-model architecture: a
        spatiotemporal DiT conditioned on keyboard actions via AdaLN-style conditioning, and on prior context
        frames (including the initial prompt frame), which generates video frames with{" "}
        <Ext href="https://arxiv.org/abs/2010.02502">DDIM</Ext> in pixel space, autoregressively (
        <Ext href="https://arxiv.org/abs/2407.01392">diffusion forcing</Ext>). I also ran a scaling analysis
        over toy model sizes from 5M to 58M parameters on a log-log scale.
      </>
    ),
    media: { kind: "video", src: `${DEMOS}/coinrun.mp4` },
    links: [{ label: "github", href: "https://github.com/joshuayanggithub/coinrun" }],
    selected: true,
    featured: true,
  },
  {
    year: "2025",
    title: "Real2Sim and Real2Sim2Real Cloth Folding",
    description: (
      <>
        <span class="project-questions">
          1. How does varying simulation data fidelity affect sim2real performance?
          <br />
          2. How can next-generation (differentiable) physics simulation data be leveraged for post-training
          policies?
        </span>
        Built a real2sim pipeline in <Ext href="https://github.com/newton-physics/newton">NVIDIA Newton</Ext>,
        with domain randomization (varying cloth meshes, physics engine solvers, and the cloth's stiffness,
        damping and particle size, etc.) to generate ~10K{" "}
        <Ext href="https://arxiv.org/abs/2210.09347">heuristic-based</Ext> cloth-folding demonstrations for
        downstream policies: imitation-learning paradigms like diffusion policy, or post-training foundation
        models. Also explored a real2sim2real pipeline by developing hardware drivers and infrastructure for
        creating a digital twin from teleop → sim.
      </>
    ),
    media: { kind: "video", src: `${DEMOS}/cloth-folding-sim-card.mp4` },
    selected: true,
  },
  {
    title: "Image Generation",
    description:
      "Implemented DDPM/DDIM with CFG and VAE encoding trained with UNet on ImageNet-100 with 8xH100s on PSC. Also tried VAE reconstruction on faces.",
    media: { kind: "image", src: `${DEMOS}/Diffusion.png`, alt: "Diffusion demo" },
  },
  {
    title: "Household Robot",
    description:
      "Finetuned VLA (π0.5, SmolVLA) on cloth folding tasks, succeeding almost 100% of time on trained tasks - pretraining allows robot to adapt to disruptions/mistakes as well.",
    media: { kind: "video", src: `${DEMOS}/clothfoldingdemo.mp4` },
    selected: true,
  },
  {
    year: "2024",
    title: "SLAM Robot",
    description:
      "Implemented differential drive controller, EKF, sensor fusion, and 2D LiDAR SLAM in ROS2 Humble - simulated in Gazebo. ",
    media: { kind: "image", src: `${DEMOS}/slam.png`, alt: "SLAM demo" },
  },
  {
    year: "2023",
    title: "STEM Competition Web App",
    description:
      "Designed and built a multiplayer web app for lobbies and competing against players in science bowl/mathcounts Countdown games in real-time before agentic IDEs existed. ",
    media: { kind: "image", src: `${DEMOS}/compverse.png`, alt: "Compverse demo" },
  },
  {
    title: "FRC 7419 (9919) ChargedUp Robot",
    description:
      'Led the design, fabrication, assembly, and programming of a) omnidirectional drivetrain b) lowered center of gravity c) lower four-bar arm linkage for FRC 7419\'s offseason "ChargedUp" Robot - This year\'s game aimed to pick-and-place cube balloons and traffic cones in versatile positions.',
    media: { kind: "image", src: `${DEMOS}/9919.png`, alt: "FRC 7419 Robot" },
  },
  {
    title: "Quadcopter FPV Drone",
    description: "A simple wiring, assembly, and installation for a quadcopter FPV drone.",
    media: { kind: "image", src: `${DEMOS}/fpv.JPG`, alt: "FPV Drone" },
  },
]

function ProjectCard({ project }: { project: Project }) {
  const card = (
    <div class={["project-item", project.selected && "is-selected", project.featured && "is-featured"].filter(Boolean).join(" ")}>
      <div class="project-year">{project.year ?? ""}</div>
      <div class="project-content">
        {project.media.kind === "video" ? (
          <video src={project.media.src} class="project-media" autoplay loop muted playsinline></video>
        ) : (
          <img src={project.media.src} alt={project.media.alt ?? ""} class="project-media" />
        )}
        <div class="project-text">
          <span class="project-title">{project.title}</span>
          <span class="project-description">{project.description}</span>
          {project.links && (
            <span class="project-links">
              {project.links.map((l) => (
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  )
  if (!project.annotation) return card
  return (
    <div class="project-item-wrapper">
      <div class="project-annotation">
        <span class="annotation-arrow"></span>
        <span class="annotation-text">{project.annotation}</span>
      </div>
      {card}
    </div>
  )
}

export function HomePage({ nav }: { nav: unknown }) {
  return (
    <>
      <header>
        {nav}
        <p class="last-updated">
          last updated: <span id="last-commit-date">loading...</span>
        </p>
        <h1>Joshua Yang</h1>
      </header>

      <main>
        <section id="about">
          <h3>about</h3>
          <p>
            I study CS at CMU, with a focus in ML. Generally interested in many things, including generative
            models and their underlying theory; reinforcement learning; foundation models in language and
            robotics and their connections.
          </p>
          <p>
            <span class="highlight-red">Connect with me!</span> Always eager to chat and talk about the latest
            research/news. Share some stuff you're working on, or others' work you find interesting : )
          </p>
        </section>

        <section id="projects" class="show-selected">
          <h3>projects</h3>
          <div class="project-filters" role="tablist" aria-label="Project filter">
            <button type="button" class="project-filter is-active" data-filter="selected" role="tab" aria-selected="true">
              selected
            </button>
            <button type="button" class="project-filter" data-filter="all" role="tab" aria-selected="false">
              all
            </button>
          </div>
          {PROJECTS.map((project) => (
            <ProjectCard project={project} />
          ))}
        </section>
      </main>

      <footer>
        <p>© 2026 Joshua Yang</p>
        <section id="visitors">
          <div class="map-widget" id="map-container"></div>
        </section>
      </footer>
    </>
  )
}
