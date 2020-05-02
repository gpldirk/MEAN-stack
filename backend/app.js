const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')

// connect to local mongodb
const config   = require('./config/database')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect(config.database)

// connection on
mongoose.connection.on('connected', () => {
  console.log('connected to database ' + config.database)
})

// connection error
mongoose.connection.on('error', (err) => {
  console.log('database error' + err)
})

const app = express()
const port = 3000

// cors middleware - allow different domains
app.use(cors())

// passport middleware - authentication
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// body-parser middleware - parse json request body
app.use(bodyParser.json())

// user routes
const users = require('./routes/users')
app.use('/users', users)

// index router
app.get('/', (req, res) => {
  res.send("invalid end point")
})

// serve app
app.listen(port, () => {
  console.log('server started on port ' + port)
})
