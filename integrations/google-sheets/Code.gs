/**
 * Think Flow First — Google Sheets Lead Receiver
 * V2.1
 *
 * SETUP
 * 1. Create a Google Sheet named "Think Flow First Leads".
 * 2. Open Extensions > Apps Script and paste this file.
 * 3. In Apps Script Project Settings > Script Properties add:
 *      SPREADSHEET_ID = <Google Sheet ID>
 *      TFF_WEBHOOK_SECRET = <long random secret>
 *      HELP_NOW_EMAIL = nick81733@gmail.com
 * 4. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Set Render LEAD_WEBHOOK_URL to:
 *      https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec?secret=<same secret>
 */

const HEADERS = [
  'Lead ID',
  'Received At',
  'Name',
  'Email',
  'WhatsApp / Telegram',
  'Country / City',
  'Entry Door',
  'Relationship',
  'Situation',
  'Timing',
  'Biggest Challenge',
  'Goal / Hope',
  'Current Care',
  'Help Now',
  'Country Alert',
  'Keep Posted',
  'Flow First Brief Opt-in',
  'Source',
  'Campaign',
  'Hook',
  'Delivery Channel',
  'Landing URL',
  'Status',
  'Owner',
  'Follow-up Date',
  'Notes',
  'Outcome'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const props = PropertiesService.getScriptProperties();
    const expectedSecret = props.getProperty('TFF_WEBHOOK_SECRET') || '';
    const suppliedSecret = (e && e.parameter && e.parameter.secret) || '';

    if (!expectedSecret || suppliedSecret !== expectedSecret) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    const payload = JSON.parse((e.postData && e.postData.contents) || '{}');
    const answers = payload.answers || {};
    const attribution = payload.attribution || {};

    const spreadsheetId = props.getProperty('SPREADSHEET_ID');
    if (!spreadsheetId) throw new Error('SPREADSHEET_ID is not configured');

    const ss = SpreadsheetApp.openById(spreadsheetId);
    const allLeads = getOrCreateAllLeadsSheet(ss);

    const intents = Array.isArray(answers.intents)
      ? answers.intents
      : (answers.intent ? [answers.intent] : []);

    const helpNow = intents.includes('help-now');
    const countryAlert = intents.includes('country-alert');
    const keepPosted = intents.includes('keep-posted');

    const leadId = Utilities.getUuid();
    const receivedAt = payload.receivedAt || new Date().toISOString();

    const row = [
      leadId,
      receivedAt,
      answers.name || '',
      answers.email || '',
      answers.messaging || '',
      answers.country || '',
      attribution.entryDoor || '',
      answers.relationship || '',
      answers.situation || '',
      answers.timing || '',
      answers.challenge || '',
      answers.goal || '',
      answers.currentCare || '',
      helpNow,
      countryAlert,
      keepPosted,
      Boolean(answers.flowFirstBrief),
      attribution.originalSource || '',
      attribution.campaign || '',
      attribution.hook || '',
      attribution.deliveryChannel || '',
      attribution.landingUrl || '',
      helpNow ? 'Action Needed' : 'New',
      '',
      '',
      '',
      ''
    ];

    allLeads.appendRow(row);
    ensureOperationalViews(ss);

    if (helpNow) {
      sendHelpNowAlert(props, {
        leadId,
        receivedAt,
        name: answers.name || '',
        email: answers.email || '',
        messaging: answers.messaging || '',
        country: answers.country || '',
        entryDoor: attribution.entryDoor || ''
      });
    }

    return jsonResponse({ ok: true, leadId });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: 'server_error' });
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateAllLeadsSheet(ss) {
  let sheet = ss.getSheetByName('All Leads');
  if (!sheet) sheet = ss.insertSheet('All Leads');

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function ensureOperationalViews(ss) {
  ensureQueryView(
    ss,
    'Help Now',
    '=QUERY(\'All Leads\'!A:AA,"select * where N = TRUE",1)'
  );
  ensureQueryView(
    ss,
    'Country Waitlist',
    '=QUERY(\'All Leads\'!A:AA,"select * where O = TRUE",1)'
  );
  ensureQueryView(
    ss,
    'Keep Posted',
    '=QUERY(\'All Leads\'!A:AA,"select * where P = TRUE",1)'
  );
}

function ensureQueryView(ss, name, formula) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange('A1').setFormula(formula);
    sheet.setFrozenRows(1);
  }
}

function sendHelpNowAlert(props, lead) {
  const recipient = props.getProperty('HELP_NOW_EMAIL') || 'nick81733@gmail.com';
  const subject = 'Think Flow First — New Help Now lead';

  const safe = value => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const htmlBody =
    '<p><strong>New Think Flow First Help Now lead</strong></p>' +
    '<p>' +
    '<strong>Name:</strong> ' + safe(lead.name) + '<br>' +
    '<strong>Country / City:</strong> ' + safe(lead.country) + '<br>' +
    '<strong>Entry door:</strong> ' + safe(lead.entryDoor) + '<br>' +
    '<strong>Email:</strong> ' + safe(lead.email) + '<br>' +
    '<strong>WhatsApp / Telegram:</strong> ' + safe(lead.messaging) + '<br>' +
    '<strong>Received:</strong> ' + safe(lead.receivedAt) + '<br>' +
    '<strong>Lead ID:</strong> ' + safe(lead.leadId) +
    '</p>' +
    '<p>Open the restricted Think Flow First lead sheet to review the seven-question answers. Detailed health information is intentionally not included in this email.</p>';

  MailApp.sendEmail({
    to: recipient,
    subject,
    htmlBody
  });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
