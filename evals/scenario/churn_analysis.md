# Churn analysis (Data team, cc: exec)

Pulled cohort data on customers who contacted support in the last quarter.

- Customers who file **2+ tickets and do not get a resolution within 72h** churn at
  **3.1x** the baseline rate.
- Customers who filed a **"double charged"** ticket and were **not refunded within
  a week** churn at **~4x** baseline, and ~15% of them initiate a card chargeback
  (which puts the payment-processor account at risk above a threshold).

Implication flagged by the team: the double-charge tickets are not just volume —
they are a leading indicator of churn and chargeback risk. The tickets are how we
currently find out which customers were affected.
