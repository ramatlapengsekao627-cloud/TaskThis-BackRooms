// db.js - handles connection to MySQL database hosted on Railway
// uses mysql2 package instead of mssql

const mysql = require('mysql2/promise')

// creates a connection pool using Railway MySQL credentials from .env file
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

// tests the connection when server starts
pool.getConnection()
  .then(() => console.log('MySQL database connected successfully'))
  .catch(err => console.log('Database connection failed:', err.message))

module.exports = pool