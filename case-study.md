# Customer Retention Risk Model

## Executive summary

This project asks a practical question: can a transparent model identify likely customer cancellations early enough for a retention team to respond thoughtfully?

The public implementation uses synthetic customer-level records and a logistic-regression pipeline. It produces an account-level risk probability, groups scores into review bands, and exposes the strongest directional score drivers. The model supports prioritization. A trained owner remains responsible for deciding whether and how to engage.

## Business problem

Cancellation is usually the end of a longer customer story. Installation delays, recurring support friction, low engagement, short tenure, and flexible contracts may become useful early signals when they are measured before the outcome.

The operating goal is to rank risk before cancellation while preserving customer context and review capacity.

## Modeling approach

1. Define the scoring moment and exclude information created afterward.
2. Impute missing numerical and categorical values inside the pipeline.
3. One-hot encode categorical features and standardize numerical features.
4. Fit logistic regression on a stratified training sample.
5. Evaluate ranking, queue quality, missed cases, and calibration on held-out data.
6. Translate probability into low, review, and high-priority operating bands.

## Why logistic regression

Logistic regression creates a strong interpretable baseline. It is fast, easy to reproduce, and makes the direction of each feature contribution visible. A more complex model should only replace it if it delivers a meaningful and validated improvement without weakening governance.

## Evaluation design

Accuracy is not sufficient for an imbalanced retention problem. The scorecard includes ROC AUC, precision, recall, Brier score, calibration, and segment-level recall. The threshold is selected with intervention cost, missed cancellations, available capacity, and customer experience in view.

## Operating model

* Score: create a timestamped probability from approved pre-outcome features.
* Review: show leading drivers and let a trained owner confirm the plan.
* Intervene: record action, channel, timing, and response.
* Learn: measure incremental retention lift, calibration, and segment outcomes.

## Key control

Never train on the answer in disguise. Cancellation status, post-cancellation monitoring states, and fields updated after the scoring moment are excluded from production features.

## Public release

The repository contains synthetic samples, generic feature categories, anonymized documentation, and a browser-only demonstration model. Raw company records and private encodings remain outside the project.
