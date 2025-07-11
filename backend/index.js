const express = require('express');
const app = express();
app.use(express.json());

app.post('/user', (req, res) => {
  console.log('收到 /user 請求', req.body);
  res.status(200).send('User created');
});
app.post('/customer', (req, res) => res.status(200).send('Customer created'));
app.post('/login', (req, res) => {
  console.log('收到 /login 請求', req.body);
  res.status(200).send('mock-session-token-12345');
});
app.post('/rapidsteptest', (req, res) => res.status(200).send('Saved'));
app.get('/riskscore/:email', (req, res) => res.status(200).json({ score: 1 }));

app.use((req, res) => {
  console.log('404:', req.method, req.url);
  res.status(404).send('Custom 404: ' + req.method + ' ' + req.url);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
}); 