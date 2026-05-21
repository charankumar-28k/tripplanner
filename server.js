const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('./db');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'wandr_secret_2025';

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// ── Auth middleware ────────────────────────────────────────────────────────────
function auth(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function safeUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const existing = db.findUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hashed = bcrypt.hashSync(password, 10);
  const user   = db.createUser({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed, phone: phone || null });
  const token  = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: safeUser(user) });
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const user = db.findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: safeUser(user) });
});

// ── GET ME ────────────────────────────────────────────────────────────────────
app.get('/api/auth/me', auth, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(safeUser(user));
});

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
app.put('/api/auth/profile', auth, (req, res) => {
  const { name, avatar, phone, bio } = req.body;
  const fields = {};
  if (name)   fields.name   = name.trim();
  if (avatar) fields.avatar = avatar.trim();
  if (phone !== undefined) fields.phone = phone;
  if (bio   !== undefined) fields.bio   = bio;
  const user = db.updateUser(req.user.id, fields);
  res.json(safeUser(user));
});

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
app.put('/api/auth/password', auth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'Both passwords are required' });
  if (newPassword.length < 6)
    return res.status(400).json({ error: 'New password must be at least 6 characters' });

  const user = db.findUserById(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password))
    return res.status(401).json({ error: 'Current password is incorrect' });

  db.updateUser(req.user.id, { password: bcrypt.hashSync(newPassword, 10) });
  res.json({ message: 'Password updated successfully' });
});

// ── SAVE TRIP ─────────────────────────────────────────────────────────────────
app.post('/api/trips', auth, (req, res) => {
  const { destination, days, budget, travellers, preferences, itinerary, notes } = req.body;
  if (!destination || !days || !budget)
    return res.status(400).json({ error: 'destination, days and budget are required' });

  const trip = db.createTrip({
    user_id: req.user.id, destination, days: Number(days),
    budget: Number(budget), travellers, preferences, itinerary, notes
  });
  res.status(201).json({ id: trip.id, message: 'Trip saved!' });
});

// ── GET ALL TRIPS ─────────────────────────────────────────────────────────────
app.get('/api/trips', auth, (req, res) => {
  res.json(db.getTripsByUser(req.user.id));
});

// ── GET SINGLE TRIP ───────────────────────────────────────────────────────────
app.get('/api/trips/:id', auth, (req, res) => {
  const trip = db.getTripById(Number(req.params.id), req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json(trip);
});

// ── DELETE TRIP ───────────────────────────────────────────────────────────────
app.delete('/api/trips/:id', auth, (req, res) => {
  const deleted = db.deleteTrip(Number(req.params.id), req.user.id);
  if (!deleted) return res.status(404).json({ error: 'Trip not found' });
  res.json({ message: 'Trip deleted' });
});

// ── STATS ─────────────────────────────────────────────────────────────────────
app.get('/api/stats', auth, (req, res) => {
  res.json(db.getStatsByUser(req.user.id));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✦ Wandr backend running → http://localhost:${PORT}`);
  console.log(`✦ Database file        → wandr_db.json`);
  console.log(`✦ Open index.html in browser or visit http://localhost:${PORT}\n`);
});
