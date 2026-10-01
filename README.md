# Ziina Rent Shield

> A payments-confidence layer for UAE landlords: schedule rent, detect risk before the due date, and recover through Ziina actions.

**Product Owner:** Jessica Jabr  
**Case study:** Ziina Payments Experience take-home  
**Prototype:** [Open the clickable prototype](https://preview--rentshield-ziina.lovable.app/)

---

## The product idea

Rent Shield is a focused Ziina payments experience for small landlords and boutique property managers in the UAE.

The product turns a lease into a visible rent-payment schedule and makes each payment legible as **safe, due soon, at risk, paid, retrying, or recovered**. When a payment is likely to fail, the landlord gets a clear recovery action instead of having to manually chase the tenant.

The core thesis:

> Landlords do not only need a new way to collect rent. They need confidence that future rent will arrive, and a clear next action before a missed payment becomes a manual chasing problem.

The concept stays deliberately within Ziina's payments lane. It does not attempt to replace property-management software, underwriting, legal enforcement, Ejari registration, or rental financing.

---

## Problem

For a small landlord managing multiple units, the painful moment is not simply collecting rent. It is uncertainty before and after the due date:

- Will the payment clear?
- Did the tenant authorize it?
- Is it pending, failed, or settled?
- If it is at risk, what should I do next?

The current workaround can involve WhatsApp reminders, screenshots, calendar nudges, manual checking, and awkward chasing.

Rent Shield makes the state of each payment visible and gives the landlord a next action.

---

## Primary user

**Small UAE landlords and boutique property managers managing roughly 1–25 units.**

This user is large enough to feel payment-operational pain but often does not have enterprise property-management tooling.

The first customer hypothesis is intentionally narrow: validate a high-frequency, visible payment problem before expanding into broader property management.

---

## Product hypothesis

If Ziina converts a cheque-based lease into a visible rent schedule with tenant authorization, payment status, and recovery actions before the due date, then landlords will feel enough control to shift rent collection into Ziina.

The prototype tests whether a landlord can:

1. Identify a risky payment quickly.
2. Understand why it is at risk.
3. Choose the next best action without calling, chasing, or guessing.

---

## What I built

### 1. Rent schedule
Annual rent is translated into lease-linked payment events with due dates and AED amounts.

### 2. Risk detection
Payment states include authorization missing, due soon, failed, retrying, recovered, and settlement pending.

### 3. Recovery actions
The landlord can:

- Send a Ziina payment link
- Send a WhatsApp reminder
- Retry Pay by Bank
- Mark the issue resolved

### 4. Payment visibility
The experience uses a dashboard, schedule, status chips, payment timeline, recovery flow, and confirmation states to make the money movement legible.

---

## Product decisions

### Narrow the problem

I deliberately did **not** build a rental super-app.

Excluded from V1:

- Underwriting
- Rent-now-pay-later
- Rent financing
- Guarantees
- Escrow
- Legal collections
- Full property-management CRM
- Ejari integration
- Rewards

These either expand the scope beyond Payments Experience, introduce regulatory or capital considerations, or make the first validation loop unnecessarily broad.

The product promise is simpler: **visibility + recovery**.

---

## Research signals

The research compared MENA and global rent-payment, recurring-payment, and property-management patterns.

Key signals:

- UAE rental patterns are moving toward more flexible digital payment structures.
- Contract-linked payment tracking validates the value of payment-status visibility.
- Recurring-payment products demonstrate the importance of mandates, tracking, and failure alerts.
- Property-management products combine collection, communication, and financial visibility.
- Rent-payment products show that reliability and payment support can matter more than rewards.

The resulting product direction was to build an operational certainty layer rather than another wallet or full property-management system.

---

## AI-assisted product workflow

AI was used as a product-development accelerator, not as a substitute for product judgment.

**ChatGPT**
- Product strategy
- Competitive synthesis
- Prompt refinement
- Document drafting

**Deep research**
- Comparable market evidence across MENA, the U.S., and Europe
- Rent-payment and recurring-payment patterns

**Lovable**
- Rapidly translating structured product decisions into a working interactive prototype

The most useful prompts were the ones that forced specificity: identifying validated market patterns, challenging the scope, and translating one landlord pain point into a concrete UAE flow using AED, dummy tenants, payment statuses, and at-risk recovery.

---

## What I would test next

The next validation loop focuses on comprehension, trust, and behavior before heavy integration work.

### User test

Test with:

- 5 small landlords
- 3 boutique property managers

Ask participants to:

1. Find the at-risk payment.
2. Decide what to do.
3. Explain what they expect will happen next.

If users need a tutorial to understand the flow, the design needs work.

### Success metrics

- Rent schedule creation rate
- Tenant authorization rate
- Risk comprehension
- Recovery action selection before the due date
- On-time rent rate
- Recovery-before-due-date rate
- Support questions about payment status

---

## What I would build next

**1. Clickable user test**  
Validate comprehension of statuses and trust in fallback actions.

**2. Thin MVP**  
Schedule + reminders + payment-link fallback for existing Ziina Business users.

**3. Bank flow**  
Evaluate a connect-bank-once model for repeat rent cycles through Ziina's Open Finance direction.

**4. Operations layer**  
Add bulk reminders and a team audit trail only if property managers demonstrate demand.

---

## My contribution

I owned the product interpretation and concept development from problem framing through prototype and validation plan.

That included:

- Identifying the highest-value payment moment
- Defining the first customer and hypothesis
- Synthesizing competitive and market signals
- Making scope and non-scope decisions
- Designing the payment and recovery logic
- Using AI to accelerate research and prototyping
- Building the working prototype in Lovable
- Defining the next research loop and success metrics

The goal was not to maximize features. It was to demonstrate product judgment: **one pain, one hypothesis, one prototype, one measurable next step.**

---

## Prototype

### [Open Rent Shield →](https://preview--rentshield-ziina.lovable.app/)

The prototype is mobile-first and uses a realistic UAE landlord scenario with AED amounts, dummy tenants, payment statuses, recovery actions, and tenant-preview functionality.

---

## Case-study materials

- **[Clickable prototype](https://preview--rentshield-ziina.lovable.app/)**
- Product case deck: *Ziina Rent Shield*
- Take-home assignment: *Product Owner: Payments Experience*

---

*Case study by Jessica Jabr.*
