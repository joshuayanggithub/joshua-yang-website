---
title: "Jensen's Inequality"
created: "2026-08-16"
updated: "2026-09-10"
---
Remember that **convex functions** are such that line between two points lies above the function in 2-D
$$
f(\lambda x_1+(1-\lambda)x_2) \leq \lambda f(x_1)+(1-\lambda)f(x_2)
$$
This 2-D case definition is generalized to **any high-dimension**. **Concave** functions are the opposite. 

Jensen's inequality for **any convex function** states that:
$$
f(\mathbb E[u])\leq \mathbb E[f(u)]
$$
(The proof is based on expanding expectation for continuous/discrete expectations, then applying definition of convexity/concavity! Think about it!


Note that equivalently Jensen's states that **for any concave function** 
$$
f(\lambda x_1+(1-\lambda)x_2) \geq \lambda f(x_1)+(1-\lambda)f(x_2)
$$
$$f(\mathbb E[u])\geq \mathbb E[f(u)]$$
the sign just flips!
