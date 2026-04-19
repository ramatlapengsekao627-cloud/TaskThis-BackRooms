// tasks.js - contains all the API endpoints for tasks
// handles get, add, update and delete operations

const express = require('express')
const router = express.Router()
const { sql, poolPromise } = require('../config/db')

// GET /tasks - gets all tasks from the database
router.get('/', async (req, res) => {
  try {
    //retrieves all tasks from the database and sends them back as a JSON response
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
    //adds a new task to the database using the data provided in the request body
    const { title, description, due, status } = req.body
    const pool = await poolPromise
    await pool.request()
      .input('title', sql.VarChar, title)
      .input('description', sql.VarChar, description)
      .input('due', sql.VarChar, due)
      .input('status', sql.VarChar, status)
      .query('INSERT INTO tasks (title, description, due, status) VALUES (@title, @description, @due, @status)')
    res.json({ message: 'Task has been added successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /tasks/:id - updates an existing task
router.put('/:id', async (req, res) => {
  try {
    //updates a task in the database based on the id provided in the URL and the new data provided in the request body
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
    //deletes a task from the database based on the id provided in the URL
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