// Load environment variables from .env file
require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

// Connect to the MongoDB database using the DATABASE_URL from environment variables
mongoose.connect(process.env.DATBASE_URL, { useNewUrlParser: true })
const db = mongoose.connection

// Event listener for database connection error
db.on('error', (error) => console.error(error))
// Event listener for successful database connection
db.once('open', () => console.log('Connected to Database'))

// Enable parsing of JSON request bodies
app.use(express.json())

// Import and use the subscribersRouter for '/subscribers' routes
const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)

// Start the server and listen on port 3000
app.listen(3000, () => console.log('Server Started'))