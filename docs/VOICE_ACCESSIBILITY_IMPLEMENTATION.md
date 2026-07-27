# ECOCLEAN Voice Accessibility

## Implemented scope

ECOCLEAN now includes a provider-neutral voice-accessibility layer without changing its existing workflows or role model.

- Citizens can record an issue title, description, and street/landmark.
- Citizens and assigned Staff can record report-conversation messages.
- Supported pilot language selectors are English, Krio, Temne, and Mende.
- Non-English recordings return an original transcript and an English translation for confirmation.
- Nothing is inserted into a report or conversation until the user confirms the English result.
- Report-conversation messages include a Listen control.
- When cloud synthesis is unavailable, English playback falls back to the device speech engine.
- ECOCLEAN processes uploaded voice audio in memory and does not write the recording to MariaDB or the filesystem.
- Consent, provider/model metadata, status, confirmation, and audit events are recorded in MariaDB.

## Architecture

The React client uses `MediaRecorder` and sends an authenticated multipart request to the Express API. The API owns provider credentials and exposes:

- `GET /api/speech/capabilities`
- `POST /api/speech/transcribe`
- `POST /api/speech/jobs/:id/confirm`
- `POST /api/speech/synthesize`

Provider-specific calls are isolated behind the ECOCLEAN speech routes. The browser never receives the provider API key. Operational records are stored in `speech_jobs`; raw audio is not retained.

## Railway production configuration

Set these as Railway secrets; never put the key in GitHub or Vercel:

```text
SPEECH_PROVIDER=openai
SPEECH_API_KEY=<secret value>
SPEECH_API_BASE_URL=https://api.openai.com/v1
SPEECH_TRANSCRIPTION_MODEL=gpt-4o-mini-transcribe
SPEECH_TRANSLATION_MODEL=whisper-1
SPEECH_SYNTHESIS_MODEL=gpt-4o-mini-tts
SPEECH_VOICE=coral
```

Railway applies migration `009_voice_accessibility.sql` during deployment. Vercel requires no speech secret because it proxies authenticated `/api` requests to Railway.

## Safety and language limitations

Machine translation is not treated as verified evidence. Users must inspect and confirm the result. English, Krio, Temne, and Mende require physical-device testing with native speakers before certification. Poor connections, background noise, dialect variation, and provider language coverage can reduce accuracy. Manual typing remains available at all times.

The provider is replaceable. For future self-hosting, ECOCLEAN can implement the same route contract using appropriately licensed ASR, translation, and TTS models without changing the React screens or database workflow.
