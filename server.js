// server.js - the main entry point of the backend
// starts the server and connects all the pieces together

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
app.use('/api/tasks', taskRoutes)

// connects the auth routes - all auth endpoints are handled in routes/auth.js
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// starts the server on port 5000
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})