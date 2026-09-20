---
title: "DDPM - Denoising Diffusion Probabilistic Models"
publish: "2026-01-01"
created: "2025-12-31"
updated: "2026-09-10"
---
# Motivation
Given a dataset sampled from an unknown data distribution, we want to learn how to generate new samples from that distribution. While originally applied to image generation to replace [[GAN - Generative Adversarial Networks|GANs]], this applies to
- video generation
- music synthesis
- molecule generation
- galaxy generation and astrophysical simulations
- generative visuomotor policies in roboticic manipulation (modeling the conditional distribution of actions given observation embeddings)
# Setup
How do we model distributions? One one hand, we can define modeling distributions by defining a flexible function $\phi(x)$ yielding a density of $p(x) = \frac{\phi (x)}{Z}$ where $Z$ is a normalization constant. But this flexible definition makes computing $Z$ difficult. On the opposing spectrum, we can define a non-flexible but easily tractable distribution such as mixture of gaussians, that may be easy to evaluate by are not capable to describe the structure of the complex data we are trying to model. Diffusion aims to be both 1. tractable and 2. flexible (apt to model any complex distribution). 

The tractability comes from defining a Markovian chain that converts a simple known distribution (a Gaussian) to a target data distribution at the endpoint of this Markovian chain. Each step in the chain can be modeled by small and tractable perturbations (originally chosen to be gaussian noise. Empirically, it was discovered these perturbations can be arbitrary) "Since a diffusion process exists for any smooth target distribution, this method can capture **data distributions of arbitrary form**."

# Forward Diffusion Process: Markov Chain
Given an image data point $x_0$ sampled from the image dataset distribution $x_0 \sim q(x)$, the forward process add gaussian noise in a series of $T$ time steps, producing a sequence of noisy points at different timesteps ($x_1, \dots x_T$).
![[Pasted image 20251017031402.png | 500]]
(In context of images, an image of $d$ pixels can be flattened to a vector $\in \mathbb{R}^d$ (or type-checking purposes image can be normalized into pixel intensities $[-1, 1]$ instead of $[0, 255]$). 

Each transition step is a conditional probability distribution ($q(x_t \mid x_{t-1}): \mathbb{R}^d \rightarrow \mathbb{R}^+$), giving us the probability density for the image $x_t$ given the previous time step's $x_{t-1}$. We call this process Markovian, because it satisfies the Markov Property: each step only relies on the previous step: formally $q(x_t \mid x_{0:t-1}) = q(x_t \mid x_{t-1})$.
$$x_{t} \sim q(x_t \mid x_{t-1}) = \mathcal{N} (x_t; \mu_t = \sqrt{1- \beta_t} x_{t-1}, \Sigma_t = \beta_t I)$$

 $\beta_t \in [0, 1]$ is a constant given from our **noise scheduler**, $(\beta_1, \beta_2, \dots, \beta_T)$ specifying the variance (noise intensity) added each time step. 

### Choice of Markovian Kernel?
We choose $\sqrt{1-\beta_{t} }$ and $\sqrt{ \beta_{t} }$ as multipliers because variances scale with the square of a multiplier. According to the [[VAE - Variational Auto Encoder|reparameterization trick]], since $x_{t} = \sqrt{ 1-\beta_{t} } x_{t-1} + \sqrt{\beta_{t}} \epsilon$, and because $x_{t-1}$ and $\epsilon$ are sampled independently, then
 $$\operatorname{Cov}(x_t) =(1-\beta_t)\operatorname{Cov}(x_{t-1})+\beta_t I$$
Since we normalized our image to $[-1, 1]$, $var(x_0) \leq 1$ , so then $\forall t,\ Cov(x_{t}) \leq I$. This property is called "**variance preserving**" in order to prevent variance from exploding through the entire forward process! 

The more precise claim is that the second moment is preserved
#### Variance/Noise Schedule
Originally, the authors of DDPM utilizes a linear schedule. 
![[Pasted image 20251017042519.png | Variance Schedule of Linear (top) vs Cosine (bottom)]]

## Shortening the Forward Kernel
The joint distribution of the entire trajectory of $T$ time steps is the product of all $T$ different PDF 
$$
\begin{align}
q(x_{1:T} \mid x_0) &= \prod_{t=1}^T q(x_t \mid x_{0:t-1}) \tag{Chain rule} \\
&= \prod_{t=1}^T q(x_t \mid x_{t-1})  \tag{Markov Property}\\
\end{align}
$$
 can be expressed a simpler closed form expression. Let's define additional variables
- $\alpha_t = 1-\beta_t,\quad t=1,\dots,T$ defining "fraction" of the previous step’s signal retained
- $\bar\alpha_t = \prod_{s=1}^t \alpha_{s}$ denoting the "fraction" of the original image "left" after $t$ time steps.
- $\epsilon_0, \dots, \epsilon_{t-1} \sim \mathcal{N}(0, I),\ \epsilon_i \in \mathbb{R}^d$ is the gaussian noise added at each time step
and induct on $t$ or $x_t$:
$$
\begin{align}
x_1 &= \sqrt{1 - \beta_{1}}\, x_0 + \sqrt{\beta_{1}}\,\epsilon_0 = \sqrt{\bar{\alpha}_{1}}\, x_0 + \sqrt{1- \bar{\alpha}_{1}}\,\epsilon_0  \tag{Base Case }\\
\dots \\
x_t &= \sqrt{\alpha_{t} }\ x_{t-1} + \sqrt{ 1-\alpha_{t} } \epsilon_{t-1} \tag{Inductive Case} \\
&= \sqrt{\alpha_{t} }\ (\sqrt{\bar{\alpha}_{t-1}} x_{0} + \sqrt{ 1 - \bar{\alpha}_{t-1} } \epsilon') + \sqrt{ 1-\alpha_{t} } \epsilon_{t-1} \tag{Inductive Hypothesis}  \\
&= \sqrt{\alpha_t\bar\alpha_{t-1}}\,x_0 + \sqrt{\alpha_t(1-\bar\alpha_{t-1})}\, \epsilon' + \sqrt{1-\alpha_t}\,\epsilon_{t-1}\\
&= \sqrt{\bar\alpha_t}\,x_0 + \Big[\sqrt{\alpha_t(1-\bar\alpha_{t-1})}\, \epsilon' + \sqrt{1-\alpha_t}\,\epsilon_{t-1}\Big] \tag{Combine Variance Step}  \\
&= \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1- \bar{\alpha}_{t} \epsilon } \tag{See below}
\end{align} 
$$
The key combined variance step is as follows: Since $\epsilon_{t-2}$ and $\epsilon_{t-1}$ are sampled independently, the linear combination of independent Gaussians stays Gaussian (with a combined mean of $0$ still), and we can sum variance through linearity of variance.  
$$var(X+Y) = var(X) + var(Y) + \cancel{2cov(X,Y)} = \alpha_t(1-\bar\alpha_{t-1})I + (1-\alpha_t)I = \big(1-\alpha_t\bar\alpha_{t-1}\big)I = (1-\bar\alpha_t)I$$

which allows us to replace $\epsilon',\ \epsilon_{t-1}$ as sampling from a shared $\epsilon \sim \mathcal{N}(0, I)$  Thus we can write
$$x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1 - \bar{\alpha}_t}\, \epsilon$$
and thus produce a sample 
$$x_t \sim q(x_t \mid x_0) = \mathcal{N}\big(x_t; \underbrace{\sqrt{\bar{\alpha}_t}\, x_0}_{\text{mean}}, \underbrace{(1 - \bar{\alpha}_t) I}_{\text{covariance}}\big)$$

As $T \rightarrow \infty$, then we should have reached an **isotropic** Gaussian distribution, one where $x_T \sim \mathcal{N}(0,I)$ follows a perfect gaussian distribution of mean $0$. Note that is because $\bar{\alpha}_{t} \rightarrow 0$ !

This is advantageous, because we all already know how to sample gaussian noise, so  figuring out how to reverse the gaussian noise in the reverse diffusion process allows us to generate random images!

# Reverse Diffusion Process
![[Pasted image 20251225235102.png | 700]]

We want to learn the reverse distribution $q(x_{t-1} \mid x_t)$ by learning a deep learning model $p_{\theta}$ approximating this reverse distribution. This reverse process can generate new sample points from the data distribution using Gaussian samples as inputs. By iteratively applying the learned reverse transitions, we can generate samples approximating the data distribution.

But this exact reverse conditional $q(x_{t-1}\mid x_{t})$ might not be Gaussian. **In the small-step (continuous time limit), the reverse transition is locally approximately gaussian!**, so we represent the reverse as a gaussian as well. So our model $p_{\theta}$ is trying to estimate mean and variance:
$$p_{\theta}(x_{t-1} \mid x_t) = \mathcal{N}(x_{t-1}; \mu_{\theta}(x_t, t),\ \Sigma_{\theta}(x_t, t))$$
### U-Net
![[U-Net]]

### Time Embedding

# Training
Remember that we have a MLE training objective (where $\{ x_{0}^i \}_{i=1}^n$) represent the data distribution of $n$ images.
$$
\theta = \arg\max_{\theta}(J(\theta)),\ J(\theta) = \mathbb{E}_{x_{0}\sim q}[\log p_{\theta}(x_{0})] \approx \frac{1}{n}\sum_{i=1}^n \log p_{\theta}(x_{0}^i)
$$
 But the difficult is that, $p_{\theta}(x_{0})^i$  requires marginalizing over all latent variables $x_{1:T}$. Because we have $T$ nested integrals this would be intractable to compute, so we can't just optimize the log likelihood (marginal likelihood) directly.
$$p_{\theta}(x_0) = \int p_{\theta}(x_{0:T})dx_{1:T},\ p_\theta(x_{0:T}) = p(x_T) \prod_{t=1}^{T} p_\theta(x_{t-1} \mid x_t)$$
We Since $\log$ is a concave function, then [[Jensen's Inequality]] ($\log \mathbb{E} \geq \mathbb{E}[\log]$) allows us to optimize an easier objective, the **Evidence Lower BOund** given by the inequality:
$$
\begin{flalign}
\log p_{\theta}(x) &= \log \int q(x_{1:T}\mid  x_{0}) \frac{p_{\theta}(x_{0:T})}{q(x_{1:T}\mid  x_{0})} dx_{1:T}  \\
& \geq \mathbb{E}_{q(x_{1:T}\mid  x_{0})}\left[ \log \frac{p_{\theta}(x_{0:T})}{q(x_{1:T}\mid  x_{0})} \right] \tag{Jensen's Inequality + Expectation}
\end{flalign}
$$

![[Pasted image 20251024131307.png | summary ]]
# Diffusion as Markovian Hierarchical VAEs
One perspective to view diffusion models is as a stack of $T$ VAEs with an encoder encoding latents $x_{1:T}$ and a decoder that decodes images closely matching $x_{0}$. 
![[Hierarchical VAEs.png | Diffusion as Stack of VAEs | 700]]

| Standard VAE                                                  | Diffusion as "Hierarchical VAE"                                                                           |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| data $x$                                                      | clean image sample $x_0$                                                                                  |
| latents $z$                                                   | latents $x_1,\dots,x_T$                                                                                   |
| **learned** variational posterior/encoder $q_{\phi}(z\mid x)$ | **fixed** forward "encoding" process $q(x_{1:T}\mid x_0)$ defined by the noise schedule instead of $\phi$ |
| prior for latent $p(z) = \mathcal{N}(0, I)$                   | prior $p(x_T)=\mathcal N(0,I)$ given a fit noise schedule                                                 |
| learned decoder $p_\theta(x\mid z)$                           | learned decoder $p_{\theta}(x_{0}\mid x_{1:T})$                                                           |
| ELBO training objective                                       | diffusion variational bound objective                                                                     |


# Classifier-Free Guidance


# Latent DDPM


# Stable Diffusion
# Sources
https://huggingface.co/learn/diffusion-course/en/unit1/3
https://lilianweng.github.io/posts/2021-07-11-diffusion-models/
https://www.tonyduan.com/diffusion/index.html
