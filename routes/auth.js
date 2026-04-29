// auth.js - handles register and login endpoints
// register - creates a new user account with encrypted password
// login - checks credentials and returns a JWT token

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

// POST /auth/register - creates a new user account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // encrypts the password before saving to database
    const hashedPassword = await bcrypt.hash(password, 10)

    // inserts new user into users table
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    res.json({ message: 'Account created successfully' })
  } catch (err) {
    console.log('Register error:', err.message)
    res.status(500).json({ error: 'Email already exists or something went wrong' })
  }
})

// POST /auth/login - checks credentials and returns JWT token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // checks if user with that email exists
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])

    // if no user found return error
    const user = rows[0]
    if (!user) return res.status(400).json({ error: 'Invalid email or password' })

    // compares typed password with encrypted password in database
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' })

    // creates JWT token that expires after 1 day
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // sends token and user info back to frontend
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