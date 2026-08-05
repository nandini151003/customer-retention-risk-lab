# Model Card: Synthetic Customer Retention Baseline

## Intended use

This portfolio model demonstrates how an interpretable classifier can prioritize customer accounts for human retention review. It is designed for education, portfolio review, and safe technical reproduction with synthetic data.

## Out-of-scope use

The model is not approved for production scoring, automated outreach, adverse customer decisions, eligibility decisions, or performance claims about any company.

## Model details

* Model family: logistic regression
* Target: synthetic binary cancellation outcome
* Input groups: contract, tenure, installation, support, payment, and engagement
* Preprocessing: median and most-frequent imputation, one-hot encoding, numerical standardization
* Split: held-out stratified sample for the public demonstration

## Evaluation

The training script reports ROC AUC, Brier score, precision, recall, and F1 score. The React interface presents illustrative operating metrics to make the threshold trade-off understandable. Browser metrics are narrative examples and are not generated from private model artifacts.

## Limitations

Synthetic data cannot establish real-world performance. It does not reproduce every operational dependency, customer segment, policy constraint, or behavioral pattern. Apparent model quality may change substantially on real data.

## Risk controls

* Confirm that every feature exists before the scoring moment.
* Exclude cancellation status and downstream outcome proxies.
* Review calibration and error rates by approved customer segment.
* Keep a trained human responsible for the outreach decision.
* Record interventions and measure incremental retention lift.
* Monitor feature drift, score drift, queue volume, and customer experience.

## Production requirements

A production candidate requires a documented data inventory, temporal validation, duplicate-account checks, calibration, fairness review, security assessment, model approval, monitoring ownership, and a controlled experiment.
