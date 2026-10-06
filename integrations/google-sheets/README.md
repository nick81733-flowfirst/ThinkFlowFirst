# Think Flow First — Google Sheets Lead Capture (V2.1)

This integration turns the existing ThinkFlowFirst.com `/api/lead` submission into a real operating workflow.

## Flow

ThinkFlowFirst.com → Render `/api/lead` → Google Apps Script → Google Sheet

If **Help Now** is selected, Google Apps Script also emails **nick81733@gmail.com**.

## Master Sheet

Create one Google Sheet named:

**Think Flow First Leads**

The Apps Script creates these tabs automatically:

- **All Leads** — one master record per visitor
- **Help Now** — filtered operational view
- **Country Waitlist** — filtered operational view
- **Keep Posted** — filtered operational view

The person is not duplicated. The three operational tabs are dynamic views of the one master record.

## Fields captured

Lead ID, received date/time, name, email, WhatsApp/Telegram, country/city, entry door, all seven intake answers, Help Now, Country Alert, Keep Posted, Flow First Brief opt-in, source, campaign, hook, delivery channel, landing URL, status, owner, follow-up date, notes, and outcome.

## Help Now email

The email intentionally includes only:

- name
- country/city
- entry door
- email
- WhatsApp/Telegram
- received time
- lead ID

The detailed seven-question health answers remain in the restricted Google Sheet rather than being copied into email.

## Required Google setup

1. Create the Google Sheet.
2. Open **Extensions → Apps Script**.
3. Paste `Code.gs`.
4. Add Apps Script Script Properties:
   - `SPREADSHEET_ID`
   - `TFF_WEBHOOK_SECRET`
   - `HELP_NOW_EMAIL = nick81733@gmail.com`
5. Deploy the Apps Script as a **Web app**:
   - Execute as: **Me**
   - Access: **Anyone**
6. Copy the deployment URL.
7. Add the secret as the `secret` query parameter.
8. Set that complete URL as Render environment variable `LEAD_WEBHOOK_URL` for the ThinkFlowFirst V2 staging service.
9. Submit one controlled test lead.
10. Verify:
   - one row appears in **All Leads**
   - the correct operational view contains the lead
   - Help Now triggers email
   - source/campaign/hook/via attribution is preserved

## Security

The Apps Script endpoint validates a shared secret before accepting a payload. The Google Sheet should be restricted to the small team responsible for lead follow-up. Avoid broad sharing because the intake can contain health-related information.

## Production gate

Do not direct real campaign traffic to the intake until the end-to-end test above succeeds.
