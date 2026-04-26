// tasks.js - contains all the API endpoints for tasks
// This file defines the routes for managing tasks, including creating, reading, updating, and deleting tasks in the database. 
// Each route corresponds to a specific HTTP method and endpoint, allowing the frontend to interact with the backend to perform CRUD operations on tasks.

const express = require('express')
const router = express.Router()
const { sql, poolPromise } = require('../config/db')

// GET /tasks - gets all tasks from the database
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise
    const result = await pool.request().query('SELECT * FROM tasks')
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /tasks - adds a new task to the database
router.post('/', async (req, res) => {
  try {
    const { title, description, due, status } = req.body
    console.log('Received task:', req.body)
    const pool = await poolPromise
    await pool.request()
      .input('title', sql.VarChar, title)
      .input('description', sql.VarChar, description)
      .input('due', sql.VarChar, due)
      .input('status', sql.VarChar, status)
      .query('INSERT INTO tasks (title, description, due, status) VALUES (@title, @description, @due, @status)')
    res.json({ message: 'Task added successfully' })
  } catch (err) {
    console.log('Error adding task:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// PUT /tasks/:id/complete - marks a task as complete
// This endpoint is used when the user clicks the "Complete" button on a task.
router.put('/:id/complete', async (req, res) => {
  try {
    const pool = await poolPromise
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query("UPDATE tasks SET status='Complete' WHERE id=@id")
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
    const pool = await poolPromise
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('title', sql.VarChar, title)
      .input('description', sql.VarChar, description)
      .input('due', sql.VarChar, due)
      .input('status', sql.VarChar, status)
      .query('UPDATE tasks SET title=@title, description=@description, due=@due, status=@status WHERE id=@id')
    res.json({ message: 'Task updated successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /tasks/:id - deletes a task from the database
router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM tasks WHERE id=@id')
    res.json({ message: 'Task has been deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router