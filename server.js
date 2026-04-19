//main file that starts the backend server.
//Sets up the Express server, connects to the database, and defines the API routes for task management.

const express = require('express')
const cors = require('cors')
require('dotenv').config()

// creates the express app
const app = express()

// allows the React frontend to talk to this backend
app.use(cors())

// allows the server to understand JSON data sent from the frontend
app.use(express.json())

// connects the tasks routes - all task endpoints are handled in routes/tasks.js
const taskRoutes = require('./routes/tasks')
app.use('/tasks', taskRoutes)

// starts the server on port 5000
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})