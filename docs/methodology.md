# Methodology

## Scoring moment

The model is intended to run before a cancellation outcome is known. Every candidate feature must pass an availability test proving that its value exists at the scoring timestamp.

## Feature groups

| Group | Public examples | Control |
| --- | --- | --- |
| Acquisition | Lead channel, region group | Review proxy and segment effects |
| Contract | Term length, plan index | Use values known at scoring time |
| Delivery | Installation delay, completion | Prevent downstream outcome leakage |
| Engagement | Support touchpoints, account age | Monitor distribution drift |

## Pipeline

Numerical variables are median-imputed and standardized. Categorical variables are most-frequent-imputed and one-hot encoded. Both transformers live inside the fitted scikit-learn pipeline to prevent training and validation contamination.

## Evaluation

The reproducible example uses a held-out stratified sample. A production assessment should add a temporal holdout, duplicate-entity checks, probability calibration, confidence intervals, and segment-level error analysis.

## Threshold selection

A lower threshold catches more potential cancellations and creates a larger review queue. A higher threshold improves queue precision but may miss customers who could benefit from attention. The operating point should be chosen jointly by analytics, operations, customer experience, and governance owners.

## Explainability

The React sandbox mirrors a small illustrative logistic function. It exposes directional contributions for each input. These browser coefficients are not fitted company parameters and are deliberately separated from the Python training output.

## Monitoring

Track input drift, calibration drift, ranking performance, queue size, intervention uptake, retention lift, and performance by approved customer segments. Pause scoring when quality or fairness gates fail.
