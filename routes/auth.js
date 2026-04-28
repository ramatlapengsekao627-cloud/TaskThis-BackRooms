// auth.js - handles all authentication endpoints
// register - creates a new user account
// login - checks user credentials and returns a token

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sql, poolPromise } = require('../config/db')

// POST /auth/register - creates a new user account
router.post('/register', async (req, res) => {
  try {
    // gets name, email and password from the request body
    const { name, email, password } = req.body

    // encrypts the password before saving - 10 means how strong the encryption is
    // this means the real password is never saved to the database
    const hashedPassword = await bcrypt.hash(password, 10)

    // saves the new user to the database
    const pool = await poolPromise
    await pool.request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .query('INSERT INTO users (name, email, password) VALUES (@name, @email, @password)')

    res.json({ message: 'Account created successfully' })
  } catch (err) {
    // if email already exists this will catch it
    console.log('Register error:', err.message)
    res.status(500).json({ error: 'Email might already exist' })
  }
})

// POST /auth/login - checks credentials and returns a JWT token
router.post('/login', async (req, res) => {
  try {
    // gets email and password from the request body
    const { email, password } = req.body

    // checks if a user with that email exists in the database
    const pool = await poolPromise
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE email=@email')

    // if no user found return an error
    const user = result.recordset[0]
    if (!user) return res.status(400).json({ error: 'Invalid email or password' })

    // compares the password the user typed with the encrypted one in the database
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' })

    // creates a JWT token that contains the user id
    // the token expires after 1 day
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // sends the token and user info back to the frontend
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (err) {
    console.log('Login error:', err.message)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

module.exports = router