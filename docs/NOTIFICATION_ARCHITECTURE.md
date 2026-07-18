# Notification Architecture

In-app notifications remain local MariaDB records. External delivery uses `notification_jobs`, ordered provider records, per-attempt history, retry backoff, and dead-letter status. The provider abstraction supports SMTP, SendGrid, Mailgun, Twilio, Africa's Talking, ECOCLEAN SMS, FCM, and ECOCLEAN push. No provider owns platform business logic.

Administrators can inspect providers and jobs; only National Administrators can enable or reprioritize providers. Secrets are environment variables and are never returned by the API. Queue processing is exposed to controlled operators at `POST /api/notifications/process-queue`; production must execute it from a supervised ECOCLEAN worker schedule. Delivery is not production-ready until at least one provider is configured and verified with real recipient tests.

