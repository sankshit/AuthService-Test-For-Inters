# Full-Stack Take-Home: Password Reset for AuthService

# CANDIDATE BRIEF

**Time:** 90 minutes. **AI use:** Required. Use any AI assistant you like.

## Context

`AuthService` is a small Node.js/Express service that handles signup and login for a
web app. It's already running in a staging environment. Your job is to add a
**password reset flow**.

## The task

Add the ability for a user to reset a forgotten password:

1. `POST /auth/forgot-password` — takes an email, generates a reset token, and
   "sends" it (log the reset link to the console — no real email needed).
2. `POST /auth/reset-password` — takes a token and a new password, and updates
   the user's password if the token is valid and unexpired.

Wire these into the existing app. Reuse the existing patterns and helpers where
it makes sense.

## Ground rules

- You **must** use an AI assistant, and you must **keep a log** of your prompts
  (paste them into `PROMPT_LOG.md`). We care as much about *how* you worked with
  the AI as about the final code.
- The existing code is what's running in staging today. Treat it as you would any
  inherited codebase.
- Make the tests pass (`npm test`) and add tests for your new endpoints.
- At the end, write a short `NOTES.md`: what you changed, anything you'd flag to
  the team, and anything the AI told you that you decided *not* to follow.

## What "done" looks like

A reviewer should be able to run the service, request a reset, use the token, and
log in with the new password — and should not be able to do anything they
shouldn't.

Good luck.
