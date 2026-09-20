---
title: "U-Net"
created: "2025-10-18"
updated: "2026-08-20"
---
U-Net is a kind of neural network originally purposed for medical image segmentation (~2015) given the name based on the u-shape form when drawn:

1. In **downsampling** we operate on a feature extraction principle, applying 3x3 Convolutions followed by ReLu activation. Then iteratively apply a maxpool layer to reduce feature size while retaining features. 
2. On the bottleneck layer, where most of the important features have been extracted it is processed even further
3. Then **upsampling** layer increases information using 
	- skip connections to regain spatial details that may have been lost when downsampling. 
		we match a similar size region from downsampling, and copy a centered subset that matches width x height. Then we concatenate this to the channel dimension. 
	- deconvolution for increasing spatial size

![[U-Net.png | 600]]

