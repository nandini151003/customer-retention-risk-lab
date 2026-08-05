# Public Data Notes

The included CSV is a small synthetic sample created only to demonstrate the repository schema. Every identifier begins with `SYN` and has no relationship to a real customer or company.

The training script generates a larger synthetic dataset in memory. No raw or private dataset is required to reproduce the example workflow.

## Schema

| Field | Meaning |
| --- | --- |
| synthetic_id | Generated demonstration identifier |
| contract_type | Synthetic agreement category |
| tenure_months | Synthetic relationship age |
| installation_delay_days | Synthetic setup delay |
| support_touchpoints | Synthetic recent support count |
| autopay | Synthetic payment setting |
| engagement_index | Synthetic engagement score from 0 to 100 |
| cancelled | Synthetic binary outcome |

Do not replace this sample with raw company exports in a public branch.
