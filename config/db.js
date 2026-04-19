// db.js - handles the connection to the SQL Server database
// uses SQL Server Authentication with username and password

const sql = require('mssql')

const config = {
  server: 'localhost',
  port: 58804,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
}

// creates a connection pool - reuses connections instead of creating new ones each time
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('SQL Database connected successfully')
    return pool
  })
  .catch(err => {
    console.log('Database connection failed:', err)
  })

module.exports = { sql, poolPromise }