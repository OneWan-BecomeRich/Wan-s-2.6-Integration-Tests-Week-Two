const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// In-memory storage (use globalThis for Vercel workaround)
globalThis._users = globalThis._users || {};
globalThis._customers = globalThis._customers || {};
globalThis._sessions = globalThis._sessions || {};
globalThis._stepData = globalThis._stepData || {};
globalThis._riskScores = globalThis._riskScores || {};
globalThis._consents = globalThis._consents || {};
globalThis._clinicians = globalThis._clinicians || {};

let users = globalThis._users;
let customers = globalThis._customers;
let sessions = globalThis._sessions;
let stepData = globalThis._stepData;
let riskScores = globalThis._riskScores;
let consents = globalThis._consents;
let clinicians = globalThis._clinicians;

function logInstanceId() {
  if (!globalThis._instanceId) {
    globalThis._instanceId = Math.random().toString(36).slice(2);
  }
  console.log('[INSTANCE]', globalThis._instanceId);
}

// Add global body parsers
app.use(express.json());
app.use(express.text({ type: ['text/plain', 'application/text'] }));

// 在每個 endpoint 開頭加 logInstanceId()
app.use((req, res, next) => { logInstanceId(); next(); });

// PATCH /consent/:customer
app.patch('/consent/:customer', (req, res) => {
  console.log('[PATCH CONSENT]', req.method, req.url, req.headers, req.body);
  const token = req.headers['suresteps-session-token'] || req.headers['suresteps.session.token'];
  console.log('[PATCH CONSENT] token:', token, 'sessions:', sessions);
  const email = sessions[token];
  if (!email) {
    console.log('[PATCH CONSENT] Unauthorized: token not found');
    return res.status(401).send('Unauthorized');
  }
  consents[req.params.customer] = req.body === 'true';
  res.status(200).send('Consent updated successfully.');
});

// PATCH /consentedClinicians/:customer
app.patch('/consentedClinicians/:customer', (req, res) => {
  console.log('[PATCH CLINICIANS]', req.method, req.url, req.headers, req.body);
  const token = req.headers['suresteps-session-token'] || req.headers['suresteps.session.token'];
  console.log('[PATCH CLINICIANS] token:', token, 'sessions:', sessions);
  const email = sessions[token];
  if (!email) {
    console.log('[PATCH CLINICIANS] Unauthorized: token not found');
    return res.status(401).send('Unauthorized');
  }
  if (!clinicians[req.params.customer]) clinicians[req.params.customer] = [];
  
  // Add clinician with expiration date (1 year from now)
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  
  clinicians[req.params.customer].push({
    clinicianUsername: req.body,
    consentExpirationDate: expirationDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    })
  });
  
  res.status(200).send('Clinician consent updated successfully.');
});

// POST /login
app.post('/login', (req, res) => {
  console.log('[LOGIN]', req.method, req.url, req.headers, req.body);
  let { userName, password } = {};
  try {
    ({ userName, password } = JSON.parse(req.body));
  } catch {
    return res.status(400).send('Invalid body');
  }
  // 找到 user
  const user = users[userName] || Object.values(users).find(u => u.email === userName);
  if (user && user.password === password) {
    const token = user.email + '-token-' + Date.now();
    sessions[token] = user.email;
    return res.status(200).send(token);
  }
  res.status(404).send('User not found');
});

// POST /user
app.post('/user', (req, res) => {
  console.log('[USER]', req.method, req.url, req.headers, req.body);
  let user = req.body;
  if (typeof user === 'string') {
    try { user = JSON.parse(user); } catch { return res.status(400).send('Invalid body'); }
  }
  // 以 email 和 userName 都存一份
  if (users[user.email] || users[user.userName]) return res.status(409).send('User exists');
  users[user.email] = user;
  users[user.userName] = user;
  users[user.email].password = user.password;
  users[user.userName].password = user.password;
  res.status(200).send('User created');
});

// POST /customer
app.post('/customer', (req, res) => {
  console.log('[CUSTOMER]', req.method, req.url, req.headers, req.body);
  const token = req.headers['suresteps-session-token'] || req.headers['suresteps.session.token'];
  console.log('[CUSTOMER] token:', token, 'sessions:', sessions);
  let customer = req.body;
  if (typeof customer === 'string') {
    try { customer = JSON.parse(customer); } catch { return res.status(400).send('Invalid body'); }
  }
  const email = sessions[token];
  if (!email) {
    console.log('[CUSTOMER] Unauthorized: token not found');
    return res.status(401).send('Unauthorized');
  }
  customers[customer.email] = customer;
  res.status(200).send('Customer created');
});

// POST /rapidsteptest
app.post('/rapidsteptest', (req, res) => {
  const token = req.headers['suresteps-session-token'] || req.headers['suresteps.session.token'];
  console.log('[RAPIDSTEPTEST] token:', token, 'sessions:', sessions);
  const email = sessions[token];
  if (!email) {
    console.log('[RAPIDSTEPTEST] Unauthorized: token not found');
    return res.status(401).send('Unauthorized');
  }
  let data = req.body;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch { return res.status(400).send('Invalid body'); }
  }
  if (!stepData[data.customer]) stepData[data.customer] = [];
  stepData[data.customer].push(data);
  res.status(200).send('Saved');
});

// GET /riskscore/:email
app.get('/riskscore/:email', (req, res) => {
  const token = req.headers['suresteps-session-token'] || req.headers['suresteps.session.token'];
  const email = sessions[token];
  if (!email) return res.status(401).send('Unauthorized');
  
  // Calculate risk score based on step data
  const customerStepData = stepData[req.params.email] || [];
  let totalSteps = 0;
  let totalTime = 0;
  
  customerStepData.forEach(data => {
    totalSteps += data.totalSteps || 0;
    if (data.stepPoints && Array.isArray(data.stepPoints)) {
      totalTime += data.stepPoints.reduce((sum, time) => sum + time, 0);
    }
  });
  
  // Simple risk calculation: more steps = lower risk
  // Ensure minimum score of 1 and maximum of 100
  const riskScore = totalSteps > 0 ? Math.max(1, Math.min(100, Math.floor(100 - (totalSteps / 10)))) : 50;
  
  res.status(200).json({ score: riskScore });
});

// GET /consent/:customer
app.get('/consent/:customer', (req, res) => {
  const token = req.headers['suresteps-session-token'] || req.headers['suresteps.session.token'];
  const email = sessions[token];
  if (!email) return res.status(401).send('Unauthorized');
  if (typeof consents[req.params.customer] === 'undefined') return res.status(200).send('false');
  res.status(200).send(consents[req.params.customer] ? 'true' : 'false');
});

// GET /consentedClinicians/:customer
app.get('/consentedClinicians/:customer', (req, res) => {
  const token = req.headers['suresteps-session-token'] || req.headers['suresteps.session.token'];
  const email = sessions[token];
  if (!email) return res.status(401).send('Unauthorized');
  res.status(200).json(clinicians[req.params.customer] || []);
});

// Reset endpoint for testing (clears all in-memory data)
app.post('/reset', (req, res) => {
  users = {};
  customers = {};
  sessions = {};
  stepData = {};
  riskScores = {};
  consents = {};
  clinicians = {};
  res.status(200).send('Reset done');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    instanceId: globalThis._instanceId || 'unknown'
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404:', req.method, req.url);
  res.status(404).send('Custom 404: ' + req.method + ' ' + req.url);
});

app.listen(port, () => {
  console.log(`Backend API listening at http://localhost:${port}`);
  console.log(`Health check available at http://localhost:${port}/health`);
}); 