# ECOCLEAN SL Business Model and Revenue Plan

## Executive position

ECOCLEAN SL should operate as a mission-led environmental technology and waste-services business. Essential public waste reporting must remain free so low-income residents are never prevented from reporting health or environmental hazards. Revenue should come from organisations and optional service customers who receive measurable operational value.

The recommended model combines software subscriptions, contracted waste services, premium collections, recycling income, sponsored programmes, and paid compliance intelligence. This creates recurring revenue without selling personal citizen data or placing public safety behind a paywall.

## Paying customer groups

| Customer | Paid value | Commercial mechanism |
|---|---|---|
| Municipal and district councils | Dispatch, task management, GIS, dashboards, exports, audit trails and service-level reporting | Annual platform licence plus implementation/support contract |
| Businesses and markets | Scheduled collection, evidence of completion, invoices and compliance records | Monthly service subscription |
| Schools, hospitals, hotels and institutions | Multi-site collection, priority support and compliance reporting | Tiered institutional subscription |
| Households | Optional scheduled doorstep collection and bulky-waste pickup | Monthly plan or one-off payment |
| Construction and event operators | Time-bound waste removal and evidence certificates | Quoted service order |
| Recycling and recovery partners | Qualified material supply and collection coordination | Transaction or logistics commission |
| Development partners and corporate sponsors | Campaign management, impact evidence and public transparency | Sponsored programme contract |
| Government and regulated enterprises | Aggregated environmental intelligence and operational reports | Data-service agreement; never sale of personal citizen data |

## Recommended revenue streams

1. **Municipal platform licence** — annual access to ECOCLEAN operations, GIS, RBAC, exports, audit logs, support and service-level reporting.
2. **Commercial collection subscriptions** — recurring plans based on site count, bin volume, collection frequency and response time.
3. **Premium household collection** — optional weekly/biweekly service while ordinary incident reporting remains free.
4. **On-demand service orders** — bulky waste, event cleanup, construction waste and emergency clearances.
5. **Institutional compliance plans** — signed completion evidence, disposal history and downloadable reports.
6. **Recycling and material recovery income** — sale or revenue share for separated plastics, metals, paper and organic material.
7. **Partner marketplace commission** — controlled commission when verified third-party contractors complete approved jobs.
8. **Corporate social responsibility sponsorship** — sponsored communities, school campaigns, beach cleanups and public bins with measured impact reports.
9. **Environmental intelligence services** — aggregated, anonymised trends, hotspot analysis and planning reports under contract.
10. **Implementation, training and support** — onboarding, data migration, training and premium support for institutional customers.

## Product principles

- Citizen reports, emergency reports and public health notifications remain free.
- No user is charged merely to communicate with assigned Staff.
- Prices are displayed in new leones (NLe) and include a clear tax/fee breakdown.
- ECOCLEAN never stores a customer's mobile-money PIN.
- Payment status is confirmed only by a signed provider callback or reconciled merchant statement.
- Every price change, invoice, payment, refund and waiver is audited.
- Supervisor and Staff roles cannot alter prices or refund money.
- Administrators manage products and billing; sensitive financial approvals require separation of duties.
- Personal citizen information is never sold.

## Required business capabilities

The existing architecture should be extended incrementally with:

- Customer and organisation accounts
- Service locations and contracts
- Product/service catalogue
- Versioned price plans
- Subscriptions and renewals
- Service orders and quotations
- Invoices, line items, taxes, discounts and waivers
- Provider-neutral payment intents
- Signed payment webhooks
- Receipts, refunds and failed-payment recovery
- Daily settlement and reconciliation
- Contractor payouts and approval controls
- Revenue, receivables, collection-cost and margin dashboards
- Accounting exports and immutable financial audit logs

Payment processing must remain behind an internal `PaymentProvider` interface so Orange Money, Afrimoney, banks or a future national switch can be changed without rewriting ECOCLEAN business logic.

## Illustrative monthly pilot economics

These figures are planning assumptions, not approved prices. They must be validated through interviews, council procurement discussions, vehicle/fuel costing and merchant quotations.

| Revenue assumption | Calculation | Illustrative monthly revenue |
|---|---:|---:|
| Municipal licences | 3 × NLe 25,000 | NLe 75,000 |
| Commercial/institutional subscriptions | 25 × NLe 2,000 | NLe 50,000 |
| Premium household plans | 300 × NLe 150 | NLe 45,000 |
| On-demand services | 50 × NLe 250 | NLe 12,500 |
| Sponsorship, training and analytics | Contracted estimate | NLe 30,000 |
| **Illustrative gross monthly revenue** |  | **NLe 212,500** |

Illustrative monthly operating costs:

| Cost group | Planning allowance |
|---|---:|
| Staff wages and statutory employment costs | NLe 90,000 |
| Fleet, fuel, maintenance and disposal | NLe 60,000 |
| Hosting, backups, security and providers | NLe 10,000 |
| Customer service, administration and field supplies | NLe 15,000 |
| Insurance, compliance and contingency | NLe 15,000 |
| **Illustrative monthly operating cost** | **NLe 190,000** |
| **Illustrative operating balance before tax/capital expenditure** | **NLe 22,500** |

This base illustration is not yet sufficient for aggressive expansion. ECOCLEAN should target contracted recurring revenue that covers at least 1.3 times fixed monthly operating costs before increasing permanent payroll or fleet commitments.

## Commercial rollout

### Phase B1 — validation and contracting

- Register/confirm the operating company, tax position and bank accounts.
- Obtain written merchant proposals from Orange Money and Afrimoney.
- Interview councils, markets, hospitals, hotels, schools and construction firms.
- Validate collection costs by vehicle, distance, waste type and disposal point.
- Approve the service catalogue, price book, refund policy and contract templates.

### Phase B2 — billing foundation

- Implement organisations, plans, service orders, invoices and receipts.
- Add provider-neutral payment intents and webhook verification.
- Add financial permissions, audit events and reconciliation reports.
- Pilot with one municipality and a small group of businesses; do not activate automatic refunds initially.

### Phase B3 — recurring revenue

- Add subscriptions, renewals, arrears management and customer statements.
- Add household premium collection and institutional multi-site plans.
- Add contractor settlement controls and recycling partner transactions.

### Phase B4 — scale

- Expand only after unit economics, payment success rate, complaint rate and service completion margins are measured.
- Add sponsored programmes and anonymised environmental intelligence contracts.
- Consider carbon or environmental-credit programmes only after independent methodology and legal verification.

## Key performance indicators

- Monthly recurring revenue
- Gross and contribution margin by service type
- Revenue per vehicle and per crew
- Collection cost per completed job
- Invoice collection rate and days receivable
- Payment success and reconciliation exception rates
- Contract renewal and customer churn
- On-time completion and citizen satisfaction
- Recyclable material recovery rate
- Free public reports resolved per paying-contract revenue

## Decision gates before payment implementation

ECOCLEAN management must approve:

1. Legal entity and merchant-account owner
2. Initial paying customer segment
3. Approved products and NLe prices
4. Tax treatment and invoice requirements
5. Orange Money/Afrimoney commercial terms
6. Refund and dispute policy
7. Financial approvers and transaction limits
8. Pilot municipality and service area

Until these are decided, the software team should build only the provider-neutral billing foundation—not publish unapproved prices or collect real money.
