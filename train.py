"""Reproducible synthetic customer retention baseline.

This script generates synthetic records in memory. It does not read private data,
and its output must not be interpreted as real company performance.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import brier_score_loss, classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


RANDOM_STATE = 42


def make_synthetic_customers(rows: int = 2500) -> pd.DataFrame:
    """Create an independent synthetic dataset with plausible relationships."""
    rng = np.random.default_rng(RANDOM_STATE)
    contract = rng.choice(["month-to-month", "one-year", "two-year"], rows, p=[0.48, 0.3, 0.22])
    tenure = np.clip(rng.gamma(2.1, 12, rows), 1, 72).round().astype(int)
    delay = np.clip(rng.poisson(5, rows) + rng.binomial(1, 0.12, rows) * rng.integers(6, 18, rows), 0, 35)
    support = np.clip(rng.poisson(1.7, rows), 0, 10)
    autopay = rng.choice(["yes", "no"], rows, p=[0.58, 0.42])
    engagement = np.clip(rng.normal(64, 18, rows), 0, 100).round().astype(int)

    logit = (
        -2.35
        + 1.25 * (contract == "month-to-month")
        - 0.75 * (contract == "two-year")
        + 1.1 * (tenure < 6)
        + 0.085 * (delay - 4)
        + 0.34 * (support - 1)
        + 0.55 * (autopay == "no")
        + 0.04 * (52 - engagement)
        + rng.normal(0, 0.18, rows)
    )
    probability = 1 / (1 + np.exp(-logit))
    cancelled = rng.binomial(1, probability)

    return pd.DataFrame(
        {
            "contract_type": contract,
            "tenure_months": tenure,
            "installation_delay_days": delay,
            "support_touchpoints": support,
            "autopay": autopay,
            "engagement_index": engagement,
            "cancelled": cancelled,
        }
    )


def build_pipeline() -> Pipeline:
    numeric = ["tenure_months", "installation_delay_days", "support_touchpoints", "engagement_index"]
    categorical = ["contract_type", "autopay"]
    preprocess = ColumnTransformer(
        [
            ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), numeric),
            ("cat", Pipeline([("impute", SimpleImputer(strategy="most_frequent")), ("encode", OneHotEncoder(handle_unknown="ignore"))]), categorical),
        ]
    )
    return Pipeline([("preprocess", preprocess), ("model", LogisticRegression(max_iter=1000, class_weight="balanced"))])


def main() -> None:
    parser = argparse.ArgumentParser(description="Train a synthetic retention-risk baseline")
    parser.add_argument("--rows", type=int, default=2500, help="Number of synthetic rows")
    parser.add_argument("--export-synthetic", type=Path, help="Optional path for generated synthetic CSV")
    args = parser.parse_args()

    data = make_synthetic_customers(args.rows)
    features = data.drop(columns="cancelled")
    target = data["cancelled"]
    x_train, x_test, y_train, y_test = train_test_split(
        features, target, test_size=0.25, random_state=RANDOM_STATE, stratify=target
    )

    pipeline = build_pipeline()
    pipeline.fit(x_train, y_train)
    probability = pipeline.predict_proba(x_test)[:, 1]
    prediction = (probability >= 0.45).astype(int)

    print("Synthetic portfolio demonstration")
    print(f"Rows: {len(data):,} | Cancellation rate: {target.mean():.1%}")
    print(f"ROC AUC: {roc_auc_score(y_test, probability):.3f}")
    print(f"Brier score: {brier_score_loss(y_test, probability):.3f}")
    print(classification_report(y_test, prediction, digits=3))

    if args.export_synthetic:
        args.export_synthetic.parent.mkdir(parents=True, exist_ok=True)
        exported = data.copy()
        exported.insert(0, "synthetic_id", [f"SYN-{i:05d}" for i in range(1, len(data) + 1)])
        exported.to_csv(args.export_synthetic, index=False)
        print(f"Synthetic data written to {args.export_synthetic}")


if __name__ == "__main__":
    main()
