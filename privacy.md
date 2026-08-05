# Privacy and Public Release Design

## What is included

* Synthetic sample records with generated identifiers
* Generic customer, contract, service, and engagement features
* An illustrative browser scoring function
* An independently reproducible synthetic training pipeline
* A metadata-scrubbed public case-study document
* A synthetic risk-distribution visual

## What is withheld

* Raw customer or company records
* Names, emails, phone numbers, addresses, and account numbers
* Company, product, employee, campaign, notebook, and database identifiers
* Private feature mappings and fitted model parameters
* Credentials, endpoints, local paths, and environment files
* Production thresholds and intervention results

## Document controls

The source case study was rebuilt as a public portfolio edition rather than covered with visual redaction boxes. Before repository publication, creator metadata, last-editor metadata, revision session identifiers, and custom properties were removed from the DOCX package.

## Repository controls

The `.gitignore` excludes raw-data and private-model directories. The included privacy script scans public text files for common personal information, credentials, secret-like assignments, and local machine paths.

## Responsible boundary

All scores and metrics are illustrative. The project must not be used to make real customer decisions without new data governance, validation, fairness, security, and experimentation work.
