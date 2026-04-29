// tasks.js - all API endpoints for tasks
// GET, POST, PUT, DELETE operations on tasks table

const express = require('express')
const router = express.Router()

// pool comes from db.js - used to run SQL queries
const pool = require('../config/db')

// GET /tasks - gets all tasks from database
router.get('/', async (req, res) => {
  try {
    // runs SELECT query and gets the rows back
    const [rows] = await pool.query('SELECT * FROM tasks')
    res.json(rows)
  } catch (err) {
    console.log('Error getting tasks:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST /tasks - adds a new task to database
router.post('/', async (req, res) => {
  try {
    const { title, description, due, status } = req.body
    console.log('Received task:', req.body)
    // inserts new task into tasks table
    await pool.query(
      'INSERT INTO tasks (title, description, due, status) VALUES (?, ?, ?, ?)',
      [title, description, due, status]
    )
    res.json({ message: 'Task added successfully' })
  } catch (err) {
    console.log('Error adding task:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// PUT /tasks/:id/complete - marks a task as complete
// this must be ABOVE the general PUT route otherwise it never runs
router.put('/:id/complete', async (req, res) => {
  try {
    await pool.query(
      'UPDATE tasks SET status = ? WHERE id = ?',
      ['Complete', req.params.id]
    )
    res.json({ message: 'Task marked as complete' })
  } catch (err) {
    console.log('Error completing task:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// PUT /tasks/:id - updates an existing task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, due, status } = req.body
    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, due = ?, status = ? WHERE id = ?',
      [title, description, due, status, req.params.id]
    )
    res.json({ message: 'Task updated successfully' })
  } catch (err) {
    console.log('Error updating task:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// DELETE /tasks/:id - deletes a task from database
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id])
    res.json({ message: 'Task deleted successfully' })
  } catch (err) {
    console.log('Error deleting task:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router