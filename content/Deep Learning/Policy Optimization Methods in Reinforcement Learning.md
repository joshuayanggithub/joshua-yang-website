---
title: "Policy Optimization Methods in Reinforcement Learning"
publish: "2026-02-12"
created: "2026-02-09"
updated: "2026-09-19"
---
# Overview
Unliked value-based methods, policy optimization methods search over policy parameters $\theta$ **directly** in order to find parameters that maximize (or minimize) a policy objective function. They do not **inherently** need to exploit structured value representations for states (or state-action pairs) which are needed in value-based methods to compute an optimal policy; however, we will actually also see that modern policy optimization methods PPO/TRPO/A3C/SAC actually still learn $V_{\phi}(s)$ or $Q_{\phi}(s,a)$ as baselines in practice to boost the efficacy of the base algorithm.

In the overall [[Reinforcement Learning|Taxonomy for Policy Optimization Methods]], we roughly group these into 3 general methods
1. Evolutionary Methods: **CEM, CMA-ES, NES**
	Biologically inspired methods that directly update policies through a selecting candidate $\theta$ based on the survival of the fittest test on different policy parameters.
2. Policy Gradient Methods: **REINFORCE**
	They optimize the parameters $\theta$ directly by computing a gradient $\frac{d}{d\theta}$ of a policy function - typically an estimate - $U(\theta)$ and optimizing them via gradient ascent.
3. Actor-Critic Methods: **A2C/A3C, PPO, SAC**
	A variant of policy gradient methods that introduce value functions $V_{\phi}(s)$ or $Q_{\phi}(s,a)$ (critics) for more stable updates of our policy (actor)

In comparison to value-based methods, policy-based methods are
5. more effective in high-dimensional + continuous action spaces
	Value-based methods select optimal actions based on something like $\arg \max_{a} Q(s,a)$ that isn't feasible across high dimensions. 
6. stochastic
	Policy-based methods typically are stochastic: this is because our policy parameters $\theta$ parameterize a distribution that our actions are sampled from. Remember that value-based methods need to rely on heuristics like epsilon-greedy to embed exploration in their policies.
	
	Why is stochasticity a good thing?
	- exploration is optimal to train any policy
	- in partial-observability settings/environments, deterministic mappings aren't the optimal solution

# I. Evolutionary Methods for Policy Search
![[Evolutionary Methods in Reinforcement Learning]]
# II. Policy Gradient Methods
![[Policy Gradient Methods in Reinforcement Learning]]

# III. Actor-Critic Methods
![[Actor-Critic Methods in Reinforcement Learning]]


