# Eng estimates (Sam, eng lead)

**Double-charge bug:** root-caused. The payment webhook retries on a 2xx timeout
and occasionally double-fires, creating a second charge. Fix = add an idempotency
key on the charge call. Estimate: **~1 sprint (2 weeks)**, low risk. This stops new
double-charges. (Refunding the already-affected customers is a separate ops task.)

**Checkout flow confusion:** the two-screen redesign hurt completion (0.71 -> 0.62)
and generates the "did it go through / where's the promo field" tickets. Fixing it
properly is a **redesign, ~6-8 weeks**. A cheaper interim: add a confirmation screen
and restore the promo field inline (~1 week).

No capacity to do everything at once this month; need a priority call.
