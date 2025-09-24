const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const PORT = process.env.PORT || 3000;

// simple endpoint
app.get('/hello', async (req, res) => {
  // Optionally check DB connectivity (if env DB_* provided)
  const dbHost = process.env.DB_HOST;
  if (dbHost) {
    try {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
      const [rows] = await conn.query('SELECT 1+1 AS ok');
      await conn.end();
      return res.json({ message: `Привет от backend 👋 (db ok: ${rows[0].ok})`});
    } catch (e) {
      return res.json({ message: `Backend (DB error): ${e.message}` });
    }
  }
  res.json({ message: 'Привет от backend 👋 (no db configured)' });
});

app.listen(PORT, ()=>console.log('Backend listening on', PORT));
