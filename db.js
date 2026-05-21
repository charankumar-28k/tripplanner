// In-memory store (works on Vercel serverless)
const store = {
  users: [],
  trips: [],
  _userSeq: 0,
  _tripSeq: 0
};

function nextId(seqKey) {
  return ++store[seqKey];
}

function now() {
  return new Date().toISOString();
}

// ── USERS ─────────────────────────────────────────────────────────────────────
function createUser({ name, email, password, phone = null }) {
  const id = nextId('_userSeq');
  const user = { id, name, email, password, phone, bio: null, avatar: '🧭', created_at: now() };
  store.users.push(user);
  return user;
}

function findUserByEmail(email) {
  return store.users.find(u => u.email === email.toLowerCase().trim()) || null;
}

function findUserById(id) {
  return store.users.find(u => u.id === id) || null;
}

function updateUser(id, fields) {
  const u = store.users.find(u => u.id === id);
  if (u) Object.assign(u, fields);
  return findUserById(id);
}

// ── TRIPS ─────────────────────────────────────────────────────────────────────
function createTrip({ user_id, destination, days, budget, travellers, preferences, itinerary, notes }) {
  const id = nextId('_tripSeq');
  const trip = {
    id, user_id, destination, days, budget,
    travellers: travellers || 'solo',
    preferences: preferences || [],
    itinerary: itinerary || {},
    notes: notes || null,
    created_at: now()
  };
  store.trips.push(trip);
  return trip;
}

function getTripsByUser(user_id) {
  return store.trips
    .filter(t => t.user_id === user_id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

function getTripById(id, user_id) {
  return store.trips.find(t => t.id === id && t.user_id === user_id) || null;
}

function deleteTrip(id, user_id) {
  const before = store.trips.length;
  store.trips = store.trips.filter(t => !(t.id === id && t.user_id === user_id));
  return store.trips.length < before;
}

function getStatsByUser(user_id) {
  const trips = getTripsByUser(user_id);
  return {
    total_trips: trips.length,
    total_days: trips.reduce((s, t) => s + (t.days || 0), 0),
    total_budget: trips.reduce((s, t) => s + (t.budget || 0), 0)
  };
}

module.exports = { createUser, findUserByEmail, findUserById, updateUser, createTrip, getTripsByUser, getTripById, deleteTrip, getStatsByUser };
