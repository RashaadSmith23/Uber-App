const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const migrationFile = path.join(__dirname, 'schema.sql');

async function runMigrations() {
  try {
    const sql = fs.readFileSync(migrationFile, 'utf8');
    await pool.query(sql);
    console.log('✅ Database tables verified / created.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    // Don't crash the server; tables might already exist
  }
}

module.exports = runMigrations;