# ECOCLEAN External Dependency and Cost Register

## Purpose

This register separates what ECOCLEAN owns from services, approvals and contracts that must come from outside organisations. Amounts must be obtained through written quotations; unknown costs are deliberately not invented.

## Critical dependencies before collecting money

| Dependency | External party | Why required | Current position | Required evidence |
|---|---|---|---|---|
| Legal company and tax setup | Corporate Affairs Commission, National Revenue Authority and professional advisers | Contracts, invoicing, tax and employment | Not evidenced in repository | Registration, TIN, tax advice and invoice format |
| Merchant account | Orange Money | Mobile-money merchant collection and settlement | Merchant payment exists publicly; no ECOCLEAN contract/API credentials | Signed merchant agreement, fees, API/USSD specification, webhook security and settlement schedule |
| Merchant account | Afrimoney | Alternative wallet coverage and merchant payment | Merchant payment exists publicly; no ECOCLEAN contract/API credentials | Signed agreement, fees, API specification, webhook security and settlement schedule |
| Business bank account | Licensed Sierra Leone bank | Settlements, payroll, supplier payments and controls | Not evidenced | Account mandate, signatories and reconciliation format |
| Customer contracts | Councils, businesses and institutions | Enforceable pricing, service levels and payment terms | Not evidenced | Approved contract and SLA templates |
| Accounting and tax controls | Qualified Sierra Leone accountant/adviser | GST/tax, payroll, revenue recognition and audit readiness | Not evidenced | Written accounting policy and chart of accounts |

Orange Money publicly supports merchant purchases and business salary/allowance payments. Afrimoney publicly supports merchant payments and online payments. Public availability does not mean ECOCLEAN has API access; commercial onboarding and technical documentation are still required.

## Operating dependencies

| Priority | Dependency | Owned or external | Cost basis to obtain | Risk if missing |
|---|---|---|---|---|
| Critical | Railway/API/database hosting | External hosting; ECOCLEAN owns code/data model | Monthly compute, database, storage, egress and backups | Platform outage or data loss |
| Critical | Vercel frontend hosting | External hosting; replaceable | Monthly bandwidth/build/seat plan | Frontend unavailable or limits reached |
| Critical | Backup storage and restore environment | External or ECOCLEAN-controlled server | Storage, retention, transfer and recovery test | Irrecoverable operational/financial data |
| Critical | Production monitoring and incident response | External tools plus internal ownership | Logs, metrics, alerts and on-call staffing | Undetected failures and revenue loss |
| High | SMS provider | External adapter | Per-message, sender registration and minimum commitment | Missed collection/payment notifications |
| High | Email provider | External adapter | Per-email/domain reputation/support | Missing invoices and receipts |
| High | Push provider | Replaceable external adapter | Delivery volume and mobile implementation | Reduced engagement |
| High | Speech/translation provider | Replaceable external adapter | Audio minutes, text-to-speech characters and data terms | Local-language voice unavailable |
| High | Map tiles/geocoding | External or self-hosted | Requests, storage, bandwidth and boundary data | Poor routing/GIS experience |
| High | Malware scanning | ClamAV/self-hosted operations | Server compute, signatures and maintenance | Unsafe customer uploads |
| High | Independent penetration testing | Qualified security firm | Fixed assessment plus retest | Unverified payment/security posture |
| High | Insurance | Licensed insurer/broker | Fleet, public liability, workers and cyber cover | Unfunded operational claims |
| High | Waste disposal agreements | Councils/site operators | Tipping fees by volume/type | Illegal or unprofitable disposal |
| Medium | Customer support telephony | Telecom provider | Numbers, minutes, devices and staffing | Poor dispute resolution |
| Medium | Authoritative GIS boundaries | Government/councils/survey sources | Licensing, capture and updates | Incorrect jurisdiction billing |
| Medium | Payroll payout service | Bank/Orange Money/Afrimoney | Bulk-payment fees and approvals | Manual salary overhead |

## Internal technical debt before commercial launch

1. Production speech is installed but disabled until a secure provider key is configured.
2. Real email, SMS and push delivery credentials and end-to-end tests remain outstanding.
3. ClamAV production scanning and signature validation remain outstanding.
4. Authoritative Sierra Leone boundary polygons remain outstanding.
5. Windows/XAMPP production validation and independent penetration testing remain outstanding.
6. Financial tables, payment webhooks, reconciliation, invoices, receipts and refunds do not yet exist.
7. Accounting integration, tax rules, financial separation of duties and immutable financial reports do not yet exist.
8. Fleet/fuel/disposal unit costs have not been validated with actual operational records.
9. Current illustrative prices and margins are not approved commercial prices.

## Cost discovery worksheet

Obtain written quotations with these fields:

| Cost item | Setup fee | Monthly minimum | Unit price | Tax | Settlement delay | Contract term | Owner |
|---|---:|---:|---:|---:|---|---|---|
| Orange Money merchant services | TBD | TBD | TBD | TBD | TBD | TBD | Finance lead |
| Afrimoney merchant services | TBD | TBD | TBD | TBD | TBD | TBD | Finance lead |
| Railway production infrastructure | TBD | TBD | Usage based | TBD | N/A | Monthly/annual | Technical lead |
| Vercel production plan | TBD | TBD | Usage based | TBD | N/A | Monthly/annual | Technical lead |
| SMS provider | TBD | TBD | Per SMS | TBD | N/A | TBD | Operations lead |
| Email provider | TBD | TBD | Per email | TBD | N/A | TBD | Technical lead |
| Speech/translation | TBD | TBD | Per audio/text unit | TBD | N/A | TBD | Technical lead |
| Security assessment | TBD | N/A | Fixed scope | TBD | N/A | Project | Administrator |
| Insurance | TBD | TBD | Policy based | TBD | N/A | Annual | Finance lead |
| Disposal/tipping | TBD | TBD | Per load/tonne | TBD | TBD | TBD | Operations lead |

## Procurement rules

- Obtain at least two comparable quotations for material services where practical.
- Never select a provider solely from public retail tariffs; obtain business/API terms.
- Record data ownership, export, deletion, breach notification and termination rights.
- Require signed webhook specifications and reconciliation reports from payment providers.
- Do not expose provider secrets in Vercel, GitHub, mobile JavaScript or reports.
- Maintain a tested exit plan for every critical SaaS provider.

## Immediate outside actions

1. Contact Orange Sierra Leone Enterprise/Orange Money for merchant onboarding and technical integration terms.
2. Contact Afrimoney merchant services for API/USSD, callback and settlement terms.
3. Engage a Sierra Leone accountant and legal adviser for tax, invoicing, employment and service contracts.
4. Obtain disposal-site and fleet operating costs for the pilot jurisdiction.
5. Obtain production hosting, messaging, speech, security-testing and insurance quotations.
6. Select one municipality and 10–25 commercial customers for a priced pilot.
