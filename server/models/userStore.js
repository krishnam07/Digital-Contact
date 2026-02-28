const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'users.json');

async function loadUsers() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function saveUsers(users) {
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2), 'utf8');
}

async function findByEmail(email) {
  const users = await loadUsers();
  return users.find(u => u.email === email) || null;
}

async function findById(id) {
  const users = await loadUsers();
  return users.find(u => u.id === id) || null;
}

async function addUser(user) {
  const users = await loadUsers();
  users.push(user);
  await saveUsers(users);
  return user;
}

module.exports = { loadUsers, saveUsers, findByEmail, findById, addUser };
