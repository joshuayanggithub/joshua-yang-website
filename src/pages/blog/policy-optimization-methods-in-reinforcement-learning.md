---
layout: ../../layouts/BlogPost.astro
title: "Policy Optimization Methods in Reinforcement Learning"
publish: "2026-02-12"
created: "2026-02-09"
updated: "2026-02-12"
---

Unliked value-based methods, policy optimization methods search over policy parameters **without** computing structured value representations for states (or state-action pairs), in order to find parameters that maximize (or minimize) a policy objective function.

Let $U(\theta)$ be any policy objective function. Then the general structure would follow something like
1. Initialize policy parameters $\theta$
2. Sample trajectories $\tau_{i} = \{ s_{t}^i, a_{t}^i \}_{t=0}^T$ by deploying the current policy $\pi_{\theta}(a_{t}\mid s_{t})$
3. **Compute gradient vector $\nabla_{\theta} U(\theta)$**
   Typically this is done through estimation from collected data. 
4. Apply a *gradient ascent* update $\theta \leftarrow + \alpha \nabla _\theta U(\theta)$ 
 
In comparison to value-based methods, policy-based methods are
1. more effective in high-dimensional + continuous action spaces
   Value-based methods should generally select optimal actions based on something like $\arg \max_{a} Q(s,a)$ that faces problems across high dimensions. 
2. better at learning stochastic policies
   Policy-based methods are *naturally* stochastic: this is because our policy parameters $\theta$ parameterize a distribution that our actions are sampled from. Remember that value-based methods need to rely on heuristics like epsilon-greedy to embed exploration in their policies.

   Why is stochasticity a good thing?
   - exploration is optimal to train any policy
   - in partial-observability settings/environments, deterministic mappings aren't the only optimal solution

# Evolutionary Methods for Policy Search
These are called evolutionary methods because they closely follow the *evolution* of a population!
1. Initialize a population of parameter vectors 
   *Genotypes*
2. Make random permutations to each parameter vector
   Simulate *mutations* in *offspring*
3. Evaluate the perturbed parameter vector
4. Update your policy parameters to move to favor the best performing parameter vectors
   Survival of the *fittest* enabling *fitness* in this offspring

These are examples of black-box policy optimization, where we treat the policy and environment as a "black box" that we can query (run rollouts) and update our policy based purely on performance we can observe;
- we do not learned a structured "state" representation of state values and/or state-action values based on the structure of Bellman equations
- use gradients to update policy parameters **directly** like in policy gradient methods, but may do so **indirectly** like in NES

## CEM: Cross-Entropy Method
In this method, we 
1. sample $n$ policy parameters $\theta_{i}$ from a multivariate Gaussian distribution matrix $p_{\phi}(\theta)$
2. Evaluate those $n$ parameters to generate a reward signal or scalar return $F(\theta_{i})$
3. select a proportion $\rho$ of those parameters with highest score as our *elite samples*
4. use their corresponding $\mu$ and $\sigma^2$ to update our reference matrix for sampling, which basically means setting the new mean as the mean of those highest $\rho n$ parameters and setting the new variance as simply the variance of those selected *elite samples*!

This worked really well up to the 2010's and in low dimensional search space dimensions, shown to work well in Tetris (Szita, 2006), where we can craft a state-value function that is a linear combination of 22 basis functions $\phi(s)$  (individual column heights, height differences, etc)
$$
V_{w}(s) = \sum_{i=1}^{22} w_{i} \phi_{i}(s)
$$
These evolutionary search methods weren't a threat to DQN implementations at the time because they couldn't scale to large non-linear neural nets with thousands of parameters. 

## CMA-ES: Covariance Matrix Adaptation
Instead of limiting ourselves to diagonal Gaussian, we search by learning a full covariance matrix so instead of just updating the mean and variances, we're updating the full covariance matrix. 

Visually, if there is an objective function we are trying to reach that is best maximized with samples in a 2d rotated ellipse, then we should utilize *all the entries* in a **full** covariance matrix which then allows us to rotate a standard diagonal gaussian matrix (x-y aligned ellipse) to best maximize this objective function efficiently.

## NES -  Natural Evolutionary Strategies
NES considers every offspring when updating our policy parameters - they optimize our expected fitness objective by updating the parameters of our search distribution through a **natural gradient**, specifically updating our learned mean $\mu$, while fixing our covariance this time.

Consider the parameters of our policy $\theta \in \mathbb{R}^d$ are sampled from a Gaussian distribution with **learned** mean $\mu \in \mathbb{R}^d$ and **fixed** diagonal covariance matrix $\sigma^2I$ (which is **not** being learned). We denote this distribution as $P_{\mu}(\theta)$
$$
\theta \sim P_{\mu}(\theta ) = \mathcal{N}(\mathbf{\mu}, \sigma^2 I)
$$
Our goal is find the best possible policy distribution, parameterized by $\mu$,  that our policy is sampled from (through $\theta$)

$$
\max_{\mu} \mathbb{E}_{P_{\mu}(\theta)} F(\theta)
$$

based on a fitness score which is the expectation of reward over entire trajectories 

$$
F(\theta) = \mathbb{E}_{\tau \sim \pi_{\theta},\ s_{0} \sim \mu_{0}(s)} R(\tau)
$$

### Deriving the Natural Gradient
Computing the update for our mean $\mu$ through this objective is as follows:
$$
\begin{flalign}
\nabla_{\mu} \mathbb{E}_{\theta \sim P_{\mu}(\theta)}[ F(\theta)] &= \nabla_{\mu} \int P_{\mu}(\theta) F(\theta) d\theta \tag{use p.m.f to integrate out expectation}\\
= \int \nabla _{\mu} P_{\mu} (\theta) F(\theta) d\theta &= \int P_{\mu}(\theta) \frac{ \nabla_{\mu} P_{\mu}(\theta)}{P_{\mu}(\theta)} F(\theta) d\theta\\
&= \int P_{\mu}(\theta) \nabla_{\mu} \log P_{u}(\theta) F(\theta) d\theta  \tag{derivative of log trick!} \\
&= \mathbb{E}_{\theta \sim P_{\mu}(\theta)}[ \nabla_{\mu} \log P_{\mu}(\theta) F(\theta)] \tag{based on pmf}\\
&\approx \frac{1}{N}[\nabla _{\mu }\log P_{\mu}(\theta)   F(\theta)] \tag{Monte Carlo Sampling}\\
&\approx \frac{1}{N}\left[ \sum_{i=1}^N \frac{\theta-\mu}{\sigma^2}F(\theta) \right] \tag{$\log P_{\mu}(\theta) = - \frac{\parallel \theta - \mu \parallel}{2\sigma^2} + C$ for Gaussians}\\
&\approx \frac{1}{N}\left[ \sum_{i=1}^N \frac{\epsilon}{\sigma}F(\theta) \right] \tag{Reparameterization trick for $\theta$}
\end{flalign}
$$
From this derivation, we have shown that this gradient can be estimated by 
1. sampling $N$ parameters $\theta_{i}$, running trajectories for each parameter, and obtaining our scalar fitness score $F(\theta_{i})$ for each sample
2. Then we simply need to scale by a sampled noise term $\epsilon$ divided by our variance $\sigma$ and average out all scaled terms!

To expand on that last step, in order to back propagate through Gaussian distributions to $\mu$, then the sampling of $\theta_{i} \sim \mathcal{N}(\mu, \sigma^2 I)$ needs to be converted through the reparameterization trick so that $\theta_{i} = \mu + \sigma \epsilon_{i},\ \epsilon_{i} \sim \mathcal{N}(0, I)$. 

Based on this derivation we can now apply gradient ascent to iteratively update our $\mu$! (based on learning rate $\alpha$)

$$
\mu_{t+1} = \mu_{t} + \alpha \left[ \frac{1}{n \sigma} \sum_{i=1}^n \epsilon_{i} F(\theta_{i}) \right]
$$

### Black-Box Optimization
To clarify, this is still black-box optimization:
1. We do not need to know anything about how we are computing our fitness score, we are simply using raw output returns given our samples $\theta_{i}$
2. We are not computing computing **analytic gradients** of $F(\theta)$ wrt to $\theta$ in order to update our policy parameters **directly**; in fact, we compute gradients wrt to a **different, known object** that we have set: the search distribution $P_{\mu}(\theta)$

### Scalability + Parallelization of ES 
The reason why this scales well for large dimension $\theta$ when we are working with large neural networks is that when parallelizing this natural gradient computation across multiple worker processes, then each worker needs to compute this term $\epsilon_{i} F_{i}(\theta_{i})$. This means we need to distribute back and forth this large $\theta_{i} = \mu_{t} + \sigma \epsilon_{i}$ vector across all our $n$ workers and can do so through

1. Coordinator broadcasts $\mu_{t}$ once per update step to all workers
2. Coordinator sends $\epsilon_{i}$ to all $n$ workers individually, which allows every worker to compute $\theta_{i}$
3. Each workers runs trajectories and sends back $F(\theta_{i})$ to the central workers.

Because of reparameterization only this $\epsilon_{i}$ needs to be sent back and forth, but this is still a very large parameter, so instead we use a pseudo random number generator to compute $n$ (tiny) seeds and then send these small seeds to the $n$ workers, which can they reconstruct each large dimension $\epsilon_{i}$ and compute our returns $F(\theta_{i})$ which is just a scalar! So communication time is cut a lot.

## Local Maxima Issue
In order to prevent ES methods from getting stuck in local optima, we average our search over multiple tasks and related environments to improve robustness and our objective can become more more generalizable. 

# Policy Gradient 
We no longer consider black-box optimization methods. Instead of updating a search distribution that our policy parameters are sampled from, we directly update our policy parameters, because we need to compute analytic gradients directly!

## Policy Objective
One reasonable policy objective is to maximize our expected trajectory reward over distribution of all trajectories parametrized by our policy parameters $\theta$ (assuming a discrete trajectory space).
$$
\max_{\theta}. U(\theta) = \mathbb{E}_{\tau \sim P_{\theta}(\tau)}[R(\tau)] = \sum_{\tau}P_{\theta}(\tau) R(\tau)
$$
Remember that $P_{\theta}(\tau)$ is the probability distribution over seeing that entire trajectory when we run $\pi_{\theta}$ in our environment which abstracts three key ingredients
1. the initial state being sampled from an initial state distribution
2. the stochasticity of the policy in which actions are sampled from - this is what our $\theta$ actually parameterizes.
3. the dynamics of the environment resulting in stochastic next states $s_{t+1}$
$$
P_{\theta}(\tau) = \underbrace{ \rho_{0}(s_{0}) }_{ \text{initial state} } \prod_{t=0}^T \underbrace{ P(s_{t+1} \mid s_{t},\ a_{t}) }_{ \text{dynamics} } \underbrace{ \pi_\theta(a_{t} \mid s_{t}) }_{\text{action sampling}}
$$
It's assumed that $P$ is a probability density function that is continuous and differentiable - necessary to propagate our gradient as we will see in the derivation. 

We now need to figure out how to compute this gradient in order to find optimal $\theta$: 

## Finite-Difference Methods
One way to try and approximate policy gradient of $\pi_{\theta}(s)$ by nudging $\theta$ in every possible small amount dimension and approximate partial derivatives as such:
$$
 \frac{\partial U(\theta)}{\partial \theta_{k}} = \frac{U(\theta + \epsilon u_{k}) - U(\theta - \epsilon u_{k})}{2 \epsilon}
$$
This was used to train these AIBO robots to walk. But this is really not feasible in high dimensions

## Derivatives of the Policy Objective
Policy gradients aim to exploit our factorization of $P_{\theta}(\tau) = \prod_{t=0}^H P(s_{t+1} \mid s_{t}, a_{t}) \pi_{\theta}(a_{t} \mid  s_{t})$ to compute approximate gradient estimate for 
$$
\nabla_{\theta} U(\theta) = \nabla _{\theta} \mathbb{E}_{\tau \sim P(\tau; \theta)}[R(\tau)]
$$
In comparison to evolutionary methods, here the challenge is to compute derivatives w.r.t variables that parameterize a distribution that our expectation is summed over. The derivation uses the same log probability trick as derived for evolutionary methods; also we assume discrete trajectory space to sum over - if continuous, the derivation is largely the same but the justification for moving gradients inside the integral terms is different and above my math knowledge.
$$
\begin{flalign}
\nabla_{\theta} \mathbb{E}_{{\tau \sim P_{\theta}(\tau)}}[R(\tau)] &= \nabla_{\theta} \sum_{\tau} P_{\theta}(\tau) R(\tau) \tag{expand expectation using pmf} \\
&= \sum_{\tau}  \nabla_{\theta} P_{\theta}(\tau) R(\tau) \tag{sum rule} \\
&= \sum_{\tau} P_{\theta}(\tau) \frac{\nabla_{\theta} P_{\theta}(\tau)}{P_{\theta}(\tau)} R(\tau) \tag{prep for log prob trick}\\
&= \sum_{\tau} P_{\theta}(\tau) [\nabla_{\theta}\log P_{\theta}(\tau)] R(\tau) \tag{chain rule} \\
&= \mathbb{E_{\tau}}[\nabla_{\theta} \log P_{\theta}(\tau) R(\tau)]
\end{flalign}
$$
I think this part is intuitively explainable, our policy objective gradient is equivalent to increasing the log probability of trajectories that give a positive reward and decreasing the log probability of trajectories that give a negative reward. 

The key observation is that this expectation can be simplified much further because our trajectories do encapsulate the dynamics of the environment - but this is not specifically *parametrized* by our policy parameters, so the **derivatives of our trajectories propagate to derivatives of taking actions under our policy.**
$$
\begin{flalign}
\nabla_{\theta} \log P_{\theta} (\tau)&= \nabla_{\theta} \log \left[ \rho(s_{0})\prod_{t=0}^T P(s_{t+1} \mid  s_{t}, a_{t}) \pi_{\theta}(a_{t} \mid   s_{t}) \right] \tag{factorizing our trajectory} \\
&=  \nabla_{\theta} \left[\log \rho_{0}(s_{0}) + \sum_{t=0}^T \log P(s_{t+1} \mid  s_{t}, a_{t}) +  \log \pi_{\theta}(a_{t} \mid   s_{t}) \right]  \tag{using logs to sum out product!}\\
&=  \nabla_{\theta} \left[ \sum_{t=0}^T \log \pi_{\theta}(a_{t} \mid   s_{t}) \right] \tag{dynamics in env. are $\perp$ of policy parameters!} \\
&=  \left[ \sum_{t=0}^T \nabla_{\theta} \log \pi_{\theta}(a_{t} \mid   s_{t}) \right] \tag{sum rule} \\
\end{flalign}
$$
Then completing our derivation
$$
\begin{flalign}
\nabla_{\theta} \mathbb{E}_{\tau \sim P_{\theta}(\tau)}[R(\tau)] &= \mathbb{E}_{\tau \sim P_{\theta}(\tau)}[\nabla_{\theta} \log P_{\theta}(\tau) R(\tau)] \\
&= \mathbb{E}_{\tau \sim P_{\theta}(\tau)} [ \sum_{t=0}^T \nabla _{\theta} \log \pi_{\theta}(a_{t} \mid s_{t}) R(\tau)]\\
& \approx  \boxed{\frac{1}{N} \sum_{i=1}^N \sum_{t=0}^T \nabla _{\theta} \log \pi_{\theta} (a_{t} \mid s_{t}) R(\tau) } \tag{Monte Carlo Estimation!}
\end{flalign}
$$
To approximate the gradient, we use an empirical estimate to from $N$ sampled trajectories!
$$
\nabla_{\theta}U(\theta) \approx \frac{1}{N} \sum_{i=1}^N \sum_{t=0}^T \nabla_{\theta} \log \pi_{\theta} (a_{t} \mid   s_{t}) R(\tau)
$$

### Computing Policy Gradient
And the natural question is whether the derivative term is computable - which yes it is. 
1. If our action space is continuous, then we our policy network can be gaussian, outputting a mean and standard deviation. 
2. If our action space is discrete, obviously we apply a final softmax layer to output a discrete probability distribution over finite action space. Then for stochasticity, we can query a categorial distribution based on these probabilities for sampling.

## Temporal Structures
Can we do better than a standard $R(\tau)$ of the entire trajectory for every gradient update? One problem is the issue with scalar $R(\tau)$, why should the action an agent takes at time step $t$ be scaled by the reward trajectory of time steps that occurred before that $[0, t-1]$? 

Instead, we should emphasize causality: Only future rewards should be attributed to the action taken at timestep $t$ 
$$
G_{t} = \sum_{k=t}^T\gamma^k R(s_{k}, a_{k})
$$

# REINFORCE - Monte Carlo Policy Gradient
The above discussion concludes REINFORCE - the simplest policy gradient also referred to as "vanilla" policy gradient.
1. Initialize policy parameters $\theta$
2. Sample trajectories $\{\tau_{i} = \{s_{t}^i, a_{t}^i \}_{t=0}^T\}$ by deploying the current policy $\pi_{\theta}(a_{t} \mid s_{t})$
3. Compute gradient vector $\nabla_{\theta} U(\theta) \approx  \hat{g}  = \frac{1}{N}\sum_{i=1}^N \sum_{t=1}^T \nabla_{\theta} \log \pi_{\theta}(a_{t}^{(i)} |  s_{t}^{(i)}) G_{t}^{(i)}$  
4. Perform Gradient Ascent: $\theta \leftarrow \theta + \alpha \nabla_{\theta}U(\theta)$

## Baselines with Advantages
Our gradient estimator is unbiased, but still can have high variance
$$
\hat{g} = \frac{1}{N} \sum_{i=1}^N \sum_{t=0}^T \nabla_{\theta}\log \pi_{\theta}(a_{t} \mid   s_{t}) G_{t}
$$
One issue with weighting our gradient updates with $G_{t}$ is the following situation:
- a state $s_1$ has all actions averaging out to a high positive magnitude reward of $4000$
- a state $s_{2}$ has all actions averaging out to a negative reward of $-4000$
Then no matter if we take a very bad action at $s_1$ versus a very good action at state $s_2$ the state's baseline level of reward (expectation) is the major scaling factor in our gradient update, not the intention of whether we took a good or bad action in the first place. 

To counteract this we should then only consider the trajectory reward above our a *constant-term* baseline - **Advantages** - at that state!
$$
\begin{align*}
\hat{g}' &= \frac{1}{N}\sum_{i=1}^N\sum_{t=0}^T \nabla_{\theta}\log \pi_{\theta}(a_{t} \mid   s_{t})[G_{t} - b] \\
&= \frac{1}{N}\sum_{i=1}^N\sum_{t=0}^T \nabla_{\theta}\log \pi_{\theta}(a_{t} \mid   s_{t})G_{t} - \underbrace{ \frac{1}{N}\sum_{i=1}^N\sum_{t=0}^T \nabla_{\theta}\log \pi_{\theta}(a_{t} \mid s_{t}) b }_{ \text{how does this affect our gradient estimation?} }
\end{align*}
$$
Actually, this new $\hat{g}'$ is still equal to our original $\hat{g}$ because in expectation the baseline term has zero expectation. 
$$
\begin{align*}
\mathbb{E}_{\tau \sim P_{\theta}(\tau)}[\nabla _{\theta} \log P_{\theta}(\tau) b ] &= b \sum_{\tau} P_{\theta}(\tau) \nabla_{\theta} \log P_{\theta}(\tau)\\
&= b   \sum_{\tau} \frac{P_{\theta}(\tau) \nabla_{\theta}  P_{\theta}(\tau)}{P_{\theta}(\tau)} \\
&= b  \cdot \nabla_{\theta} \mathbb{E}_{\tau \sim P_{\theta}(\tau)}[1] = b \cdot 0 = 0
\end{align*}
$$
And our subtraction of baseline to consider relative reward has effectively reduce the scale of gradient updates quite a bit, thus we minimize variance overall!

## Baseline Choices
1. **Constant Baselines** using the average return of the policy $b = \mathbb{E}[R(\tau)]$
2. **Time-dependent Baselines** 
   $b_{t} = \sum_{i=1}^N G_{t}^{(i)}$ where we average temporal reward over all trajectories
3. **State-dependent Baselines** i.e. value function $b(s_{t}) = V_{\pi}(s)$

# Actor-Critic Methods
Actor-Critic methods build of our state-dependent baselines used in REINFORCE with baselines method where our action advantage is $A^\pi (s_{t}^i, a_{t}^i) = G_{t}^{(i)} - V_{\phi}^\pi(s_{t}^i)$. But the $G_{t}^{(i)}$ term can have high variance: it's a single rollout Monte-Carlo return based on our $s_{t}$ and $a_{t}$ and varies from our environment; but doesn't this sound familiar?

Our returns $G_{t} = \sum_{k=t}^T R(s_{k}, a_{k})$ are exactly estimated by our Q-functions $Q^\pi(s,a) = \mathbb{E}[G_{t} \mid  s_{t}, a_{t}]$ by definition. Furthermore, however, if our critic function only estimates our value functions $V_{\phi}^\pi(s)$ already, then we should expand our bellman equations to express Q-functions in terms of value functions: $Q^\pi(s,a) = \mathbb{E}[G_{t} \mid  s_{t}, a_{t}] = \mathbb{E}[R_{t} + \gamma G_{t+1} \mid  s_{t}, a_{t}] = \mathbb{E}[R_{t}+V(s_{t+1}) \mid  s_{t},a_{t}]$.

Then our action advantages can be simplified as
$$
A^\pi(s_{t}^i, a_{t}^i) = G_{t}^{(i)} - V_{\phi}^\pi(s_{t}) = R(s_{t}^i, a_{t}^i)+ \gamma V_{\phi}^\pi(s_{t+1}^{i}) - V_{\phi}^\pi(s_{t})
$$

1. Initialize **actor** policy parameters $\theta$ and **critic** parameters $\phi$
2. Sample trajectories $\{\tau_{i} = \{s_{t}^i , a_{t}^i\}_{i=0}^T \}$ by deploying our current policy $\pi_{\theta}(a_{t} \mid  s_{t})$
3. Calculate value functions $V_{\phi}^\pi(s)$ through MC or TD estimation
4. Compute action advantages $A^\pi (s_{t}^i, a_{t}^i) = G_{t}^{(i)} - V_{\phi}^\pi(s_{t}^i)$
5. $\nabla_{\theta}U(\theta) \approx \frac{1}{N}\sum_{i=1}^N \sum_{t=0}^T\log \pi_{\theta}(a_{t} \mid  s_{t}) A(s_{t}, a_{t})$
6. $\theta \leftarrow \theta + \alpha \nabla_{\theta}U(\theta)$

In some sense the actor-critic is just "policy iteration" written in gradient form. 
1. We run the policy and collect a series of $N$ trajectories. 
2. Based on the performance, we compute advantages for each time step during each trajectory 
3. Then we update our policy parameters directly using a policy gradient that is computed through these advantages.

## A2C - Advantage Actor-Critic
The trajectories we collect arrive sequentially, while stability of training our policy networks require the gradient updates to be decorrelated - a problem we fixed in Q-learning using replay buffers - a solution is A3C by parallelizing the experience collection to multiple agents in order to stabilize training. 

Workers run in parallel, computing gradients from their own rollouts, but we batch updates after each worker has finished their process to a combined gradient update step - ensuring consistent /stable gradient updates.

## A3C - Asynchronous Advantage Actor-Critic
The natural performance optimization to make is what if the workers worked asynchronously  and computed + provided gradient updates without waiting for all workers each iteration.

# PPO -  Proximal Policy Optimization
PPO is derived from policy improvement logic and more so a approximate policy iteration method than a policy gradient method.

## High UTD
$$
\text{Updates to Data (UTD)} = \frac{\text{number of gradient updates}}{\text{number of env. steps (samples)}}
$$
 Obviously it seems to us that a high UTD is efficient with collected data - and a bottleneck in RL for complex environments is exactly data collection - so we want to come up with methods that work well with high UTD.
 
  Here's the issue:

$$
\theta \leftarrow \theta + \alpha \nabla_{\theta}U(\theta)
$$
if we apply one gradient update step, then we land on a new policy $\pi'$ parameterized by $\theta'$.  We cannot compute the same policy gradient estimate for $\nabla_{\theta}U(\theta)$ by reusing the past rollouts (in order to compute the advantages). 

This means that forcing a high UTD is a noisy estimate based on limited experience and can result in policy drifts. This is a motivator for PPO and TRPO methods as we discuss, which aim to fix this issue through 

## Policy Improvement

### Performance of Policy
If we quantify the *performance* of a policy as expected return over all trajectory
$$
J(\pi) = \mathbb{E}\left[ \sum_{t=0}^\infty \gamma^t r(s_{t}, a_{t}) \right] = \mathbb{E}_{s_{0} \sim \rho}[V^\pi(s_{0})]
$$
and define a discounted *state visitation distribution* that weights time spent in a specific state $s$ over all trajectories given a policy $\pi$
$$
d^\pi(s) = \sum_{t=0}^\infty \gamma^t \Pr_{\pi} (s_{t} = s \mid s_{0} \sim \rho)
$$
where
- $\Pr_{\pi}$ specifically refers to probability over policy (all policy-induced randomness)
- the sum of all pmfs for $d^\pi(s)$ over all states $\sum_{s} d^\pi(s) = \frac{1}{1-\gamma}$
- the discounted average of some state-dependent function $f(s)$ *over trajectories is* equal to the average over state weighted by how often we visit them

$$
\sum_{t=0}^\infty \gamma^t \mathbb{E}_{\pi}[f(S_t)]
=
\sum_{t=0}^\infty \gamma^t \sum_s f(s)\Pr_\pi(S_t=s)
=
\sum_s f(s)\underbrace{\sum_{t=0}^\infty \gamma^t \Pr_\pi(S_t=s)}_{d^\pi(s)}
$$

### Performance Difference Lemma
Then we can show that the policy improvement from $\pi \rightarrow \pi'$ can be written as expected advantage over state visitation distribution and action sampling from our policy.
$$
J(\pi') - J(\pi) = \mathbb{E}_{s \sim d'^\pi,\ a \sim \pi'(\cdot \mid  s)}[A^\pi (s,a)]
$$

## Policy Improvement Formulation
We aim to find the maximum new policy $\pi'$ which corresponds to an expression
$$
\max_{\pi'}J(\pi') = \max_{\pi'}(J(\pi') - J(\pi)) = \max_{\pi'} \mathbb{E}_{s \sim d'^\pi(s), a \sim \pi'(\cdot \mid s)}[A^\pi(s, a)]
$$

#### Importance Sampling
But our whole goal for performance is to *not* sample from $\pi'$ for the $s,a$. If we can't sample from $\pi'$ (we can but the whole goal is to avoid sampling) of a distribution $p(z)$, but want to compute an expectation of a function $f(z)$ under that distribution, then **importance sampling** allows us to sample from a **different** easier proposal/behavior distribution $q(z)$ then **scale** using a term called **important weight** our function values computed from those samples through manipulation:
$$
\begin{align*}
\mathbb{E}_{z \sim p(z)}[f(z)] = \int f(z) p(z) dz = \int q(z) f(z) \underbrace{ \frac{p(z)}{q(z)} }_{ \text{weight} } dz = \mathbb{E}_{z \sim q(z)}\left[ f(z) \frac{p(z)}{q(z)} \right]
\end{align*}
$$
which works as long as the denominator isn't $0$ whenever $p(z)$ is nonzero.

### Derivation
Then to apply this trick to our formulation, we aim to express our expectation entirely in terms of $\pi$, our first attempt in re-expressing our state visitation distribution in terms of $\pi$ would be
$$
\max_{\pi'} \mathbb{E}_{s \sim d'^\pi(s),\ a \sim \pi'(\cdot\mid  s)}[A^\pi(s,a)] = \max_{\pi'} \mathbb{E}_{s \sim d^\pi(s), a\sim \pi'(\cdot\mid  s)}\left[ \frac{d^{\pi'}(s)}{d^\pi(s)}A^\pi (s,a) \right]
$$
but calculating state-visitation ratio $\frac{d^{\pi'}(s)}{d^\pi(s)}$ is hard in itself - because the discounted visitation for $\pi'$ is unknown - and if we try to estimate this ratio with a large amount of sampling, then because this is a high variance term that could explode in certain states leading to instability in the computation. 

PPO fixes this by simply keeping $\pi$ close to $\pi'$ so that the state-visitation distribution naturally induces an approximate equality of $d^{\pi'}\approx d^\pi$. And we apply the same importance sampling trick for $\pi'(\cdot\mid s_{t})$ which note the ration $\frac{\pi'(\cdot\mid s_{t})}{\pi(\cdot\mid s_{t})}$ is easy to deal with - this is computable from our policy network in a single forward pass!

$$
\begin{align*}
\max_{\pi'}\mathbb{E}_{s \sim d'^\pi(s), a \sim \pi'(\cdot \mid  s_{t})}[A^\pi (s, a)] &= \max_{\pi'} \mathbb{E}_{s \sim d^\pi(s), a \sim \pi(\cdot \mid   s_{t})}\left[ \cancelto{ 1 }{ \frac{d^{\pi'}(s)}{d^\pi(s)} \ }A^\pi(s, a) \right] \tag{PPO assumption} \\
&= \max_{\pi'}\mathbb{E}_{s \sim d^\pi(s), a \sim \pi(\cdot \mid  s_{t})}\left[  \frac{\pi(a \mid s_{t})}{\pi'(a \mid s_{t})} A^\pi (s, a) \right]
\end{align*}
$$
Now, to compute this objective max function, we need to take gradient ascent steps wrt to this object,  and rewrite in the same policy gradient form
$$
\begin{align*}
\nabla_{\theta'} \mathbb{E}_{s \sim d^\pi(s)} \mathbb{E}_{a \sim \pi(\cdot \mid  s)} [\frac{\pi'\left( a \mid  s \right)}{\pi(a \mid   s)}A^\pi(s,a)] &= \mathbb{E}_{s \sim d^\pi(s)} \mathbb{E}_{a \sim \pi(\cdot\mid  s)} [\frac{\nabla_{\theta'}\pi'(a \mid s)}{\pi(a \mid  s)} [ A^\pi(s,a)]\\
&= \mathbb{E}_{s \sim d^\pi(s)} \mathbb{E}_{a \sim \pi(\cdot\mid  s)} \pi'(a \mid s) [\frac{\nabla_{\theta'} \log \pi'(a \mid s)}{\pi(a \mid  s)} [ A^\pi(s,a)]\\
\end{align*}
$$
But we still have this issue of need to have a high UTD and resulting in policy drift. PPO aims to enforce some **closeness penalty constraints** on how far the new policy $\pi'$ can drift from $\pi$ on each gradient update! This is a regularization term. 
$$
\mathbb{E}_{s \sim d^\pi(s)}\mathbb{E}_{a \sim \pi(\cdot \mid  s)}\left[ \frac{ \nabla_{\theta'} \log\pi'(a \mid s)}{\pi(a \mid   s)}  A^\pi(s,a) \right] - \lambda \mathbb{E}_{s}[D(\pi(\cdot \mid  s), \pi'(\cdot\mid s))]
$$

## Clipped Ratio Objectives
What PPO does is use a soft approximation by utilizing ratio clipping keeping the $\frac{\pi'(a\mid s)}{\pi(a \mid s)}$ close to 1 instead of using an explicit distance metric (KL Divergence) like with TRPO.  Remember the whole purpose is to make sure the old batch is representative of the new policy so we can get high UTD. 

This can be expressed as 
$$
\max_{\pi'} \mathbb{E}_{s \sim d^\pi(s)} \mathbb{E}_{a \sim \pi(\cdot \mid   s)} \left[ min\left(  \frac{\pi'(a\mid  s)}{\pi(a\mid  s)} , clip\left( \frac{\pi'(a \mid  s)}{\pi(a\mid  s)}, 1-\epsilon , 1+\epsilon\right) \right) A^\pi(s,a) \right]
$$
Note that a naive clip objectives clips our ratio on both sides of the curve. But this has the issue of 
1. if our advantage $A > 0$ and our ratio $r < 1 - \epsilon$ 
   because the clipped value is flat on this side of the naive clip objective, the gradient zeros out, and we don't get to use this $(s,a)$ experience for gradient update even though this advantage is trying to force $\pi'(a \mid s)$ up. 
2. If our advantage $A < 0$ and our ratio $r > 1 + \epsilon$
   then our gradient zeros out once again, and we miss utilizing this $(s,a)$ experience for parameter update, even though the advantage is telling us to force $\pi'(a\mid s)$ smaller. 

Then our entire clipped objective adds a min term so that we only flattens the ratio on the side we care about!
<figure class="obsidian-figure">
  <img src="/media/attachments/policy-optimization-methods-in-reinforcement-learning/Clipped Objective.png" alt="Clipped Objective.png" loading="lazy" style="max-width: 500px;" />
</figure>

#### Asymmetric clipping
In reality we need to emphasize good actions when exploring for language models, meaning our clip term should be something like 
$$
clip\left( \frac{\pi'(s\mid  a)}{\pi(s \mid  a)}, 1-\epsilon_{-}, 1+ \epsilon_{+} \right)
$$
This means that we want to make $\epsilon_{+} < \epsilon_{-}$ so that we don't clip for higher positive advantages that we would clip if we kept $\epsilon_{-}$ fixed and had $\epsilon_{+} = \epsilon_{-}$!

# TRPO - Trust-Region Policy Optimization
If we were to keep the KL-constraint in our objective instead of a soft ratio-clipping objective with PPO, then the formulation is different. This is called TRPO.

Our surrogate objective is now
$$
\begin{gather*}
\max_{\theta} \mathbb{A}_{\pi_{old}}(\pi) = \sum_{t=1}^T \mathbb{E}_{{s_{t} \sim p_{\theta_{old}}(s_{t})}}\mathbb{E}_{a_{t} \sim \pi_{\theta_{old}}(a_{t} \mid   s_{t})}\left[ \frac{\pi_{\theta}(a_{t}\mid  s_{t})}{\pi_{\theta_{old}}(a_{t}\mid  s_{t})}A^{\pi_{old}}(s_{t}, a_{t}) \right]\\
s.t. \mathbb{E}_{t}[D_{KL}[\pi_{\theta_{old}}(\cdot\mid  s_{t}) \parallel \pi_{\theta}(\cdot \mid   s_{t})]] \leq \delta
\end{gather*}
$$

