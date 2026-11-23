const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(sendMail) {
  const context = {
    exports: {},
    console: { log() {}, error() {} },
    process: { env: {
      GMAIL_USER: 'sender@example.com', GMAIL_APP_PASSWORD: 'test-password', ALERT_EMAIL: 'admin@example.com',
    } },
    require: (name) => name === '@/lib/utils/french-display' ? loadFrenchDisplay() : name === 'server-only' ? {} : {
      createTransport: () => ({
        verify: () => { throw new Error('Redundant SMTP verification'); },
        sendMail,
      }),
    },
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/notifications/email.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, esModuleInterop: true },
  }).outputText, context);
  return context.exports.sendAdminAlert;
}

test('sends directly without a preliminary SMTP connection', async () => {
  let calls = 0;
  const send = load(async (message) => {
    calls++;
    assert.equal(message.to[0], 'admin@example.com');
    assert.equal(message.subject, 'Test');
    assert(message.text.includes('Client: Example'));
    return { messageId: 'test-id' };
  });
  assert.equal((await send('Test', { Client: 'Example' })).sent, true);
  assert.equal(calls, 1);
});

test('waits for SMTP acceptance before reporting success', async () => {
  let accept;
  const send = load(() => new Promise((resolve) => { accept = resolve; }));
  let finished = false;
  const result = send('Test', {}).then((value) => { finished = true; return value; });
  await Promise.resolve();
  assert.equal(finished, false);
  accept({ messageId: 'test-id' });
  assert.equal((await result).sent, true);
});

test('preserves delivery failure reporting', async () => {
  const send = load(async () => { throw new Error('SMTP unavailable'); });
  const result = await send('Test', {});
  assert.equal(result.sent, false);
  assert.equal(result.reason, 'delivery_failed');
});

function loadFrenchDisplay() {
  const context = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/utils/french-display.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText, context);
  return context.exports;
}

test('localizes email labels and known values while preserving submitted content', async () => {
  const details = {
    'Animaux de compagnie': 'Oui',
    'Contrat de travail': 'CDI',
    'Intérieur': 'Ongemeubileerd',
    Message: 'Oui, je souhaite visiter. <script>test</script>',
    Client: 'François Dupont',
    Email: 'francois@example.com',
  };
  const before = JSON.stringify(details);
  let delivered;
  const send = load(async (message) => { delivered = message; return { messageId: 'test-id' }; });
  assert.equal((await send('Nouvelle demande de visite — VIS-123', details)).sent, true);
  assert.equal(delivered.subject, 'Nouvelle demande de visite — VIS-123');
  assert.match(delivered.text, /Animaux de compagnie: Oui/);
  assert.match(delivered.text, /Contrat de travail: CDI/);
  assert.match(delivered.text, /Intérieur: Non meublé/);
  assert(delivered.text.includes(details.Message));
  assert(delivered.text.includes(details.Client));
  assert(delivered.html.includes('lang="fr"'));
  assert(!delivered.html.includes('<script>'));
  assert.equal(JSON.stringify(details), before);
});
