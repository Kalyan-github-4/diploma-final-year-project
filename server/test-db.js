const { sql } = require('drizzle-orm');
const { getDb } = require('./src/db/client');

console.log('Testing via drizzle getDb...');
const { db } = getDb();
db.execute(sql`SELECT 1 as test`)
  .then(r => { console.log('Drizzle connected OK:', r); process.exit(0); })
  .catch(e => { console.error('Drizzle Error:', e.message); console.error('Cause:', e.cause?.message, 'address:', e.cause?.address, 'port:', e.cause?.port); process.exit(1); });
