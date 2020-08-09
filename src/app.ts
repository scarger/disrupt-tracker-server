const express = require('express')
import { router as authRouter } from './routes/auth-router'
import { apiRouter } from './routes/api/api'

import { setupDatabase } from './data/db-manager'
import bodyParser from 'body-parser'
import keys from './config/keys'

const app = express()
const cors = require('cors')
const session = require('cookie-session')
const passport = require('passport')

const port = 3000
const frontendLocation = 'http://localhost:8080'

console.log('Setting up database')
setupDatabase().then(() => {
  const passportSetup = require('./config/passport-setup')
  passportSetup.begin()
}).catch(err => console.log(err))

const corsConfig = cors({credentials: true, origin: frontendLocation})
//app.options('*', corsConfig)
app.use(corsConfig)
app.use(session({
  keys: [keys.session.secret],
  maxAge: 24 * 60 * 60 * 1000
}))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRouter)
app.use('/api', apiRouter)

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})