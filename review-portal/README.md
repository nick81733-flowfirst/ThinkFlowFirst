# Think Flow First — Snapshot & Share Portal

Standalone portal prototype within the existing ThinkFlowFirst repository. Development branch only; do not merge into main or deploy before security review.

## Architecture
- Supabase Auth for email OTP, with verified recipient email required.
- PostgreSQL RLS authorization; invitation matched to verified email, expiry and revocation checked for every data/file request.
- Private Supabase Storage bucket `portal-private`.
- Document versions stored independently, snapshots are metadata references to specific versions (no PDF copying).
- One snapshot can be distributed via many individually managed invitations.
- No medical records or patient-identifiable clinical records should be uploaded.

## Setup
1. Prefer a dedicated Supabase project so the CRM stays independent. Review `schema.sql` with a database/security administrator; apply in SQL editor after reviewing existing policies. The script is designed for a fresh project and should not be blindly run on a shared production database.
2. Create the first admin Auth user using Supabase dashboard / approved auth flow, confirm email, then insert their `auth.users.id` into `portal_admins` using secure SQL console. There is no self-service admin creation.
3. Copy `config.example.js` to `config.js`, configure the Supabase URL and browser publishable key. Never insert a service-role key into client files or GitHub.
4. Serve this directory with a local/static web server (ES modules require HTTP rather than file://). Open index.html.
5. Configure Auth Site URL and allowed redirect URL for the portal hostname. Configure an appropriate email sending service for production OTPs.
6. Test security with three users: administrator; invited, verified recipient; and unrelated verified account. Confirm unrelated account cannot read private files or metadata and that expiry/revocation removes access. Verify immutable snapshots after updating source documents.
7. Deploy separately on Render with auto-deploy disabled, only after security verification and manual approval.

## Current limitations
- This is a direct GitHub implementation scaffold, not a published or security-audited production portal.
- External URLs are live and are not archival copies; snapshot metadata records the URL but external content may change.
- File uploads use SHA-256 matching in the client for reuse checks; upload finalization must be controlled through RLS and storage rules.
- The initial client focuses on core workflows; invitation emails, automated reminders, comparison UI, and production audit observability require further implementation.
- No real recipient invitations have been sent.
