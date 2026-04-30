const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const jwt = require('jsonwebtoken')

// middleware - checks the token and gets the user id from it
// this runs before every route to know which user is making the request
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// GET /api/tasks - gets only the tasks belonging to the logged in user
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [req.userId])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/tasks - adds a new task linked to the logged in user
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, due, status } = req.body
    await pool.query(
      'INSERT INTO tasks (title, description, due, status, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, due, status, req.userId]
    )
    res.json({ message: 'Task added successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/tasks/:id/complete - marks task as complete
router.put('/:id/complete', auth, async (req, res) => {
  try {
    await pool.query(
      'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
      ['Complete', req.params.id, req.userId]
    )
    res.json({ message: 'Task marked as complete' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/tasks/:id - updates a task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, due, status } = req.body
    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, due = ?, status = ? WHERE id = ? AND user_id = ?',
      [title, description, due, status, req.params.id, req.userId]
    )
    res.json({ message: 'Task updated successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/tasks/:id - deletes a task
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    )
    res.json({ message: 'Task deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router