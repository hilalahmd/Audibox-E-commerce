const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

dotenv.config()


const connectDB =
  require('./src/config/db')

/* USER ROUTES */
const authRoutes = require('./src/routes/user/authRoutes')
const userProductRoutes = require('./src/routes/user/productRoutes')
const userUserRoutes = require('./src/routes/user/userRoutes')
const userOrderRoutes = require('./src/routes/user/orderRoutes')
const cartRoutes = require('./src/routes/user/cartRoutes')
const wishlistRoutes = require('./src/routes/user/wishlistRoutes')

/* ADMIN ROUTES */
const adminAuthRoutes = require('./src/routes/admin/adminAuthRoutes')
const adminProductRoutes = require('./src/routes/admin/productRoutes')
const adminUserRoutes = require('./src/routes/admin/userRoutes')
const adminOrderRoutes = require('./src/routes/admin/orderRoutes')

/* SHARED ROUTES */
const uploadRoutes = require('./src/routes/uploadRoutes')
const stripeRoutes = require('./src/routes/stripeRouter')

connectDB()

const app = express()



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
})


app.use(limiter)

app.use(cookieParser())

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  exposedHeaders: ['X-Total-Count', 'X-Total-Pages', 'X-Current-Page']
}))

app.use(helmet())

app.use(express.json())



app.use((req, res, next) => {

  console.log(
    `${req.method} ${req.url}`
  )

  next()

})



app.use(
  '/api/auth',
  authLimiter,
  authRoutes
)

app.use(
  '/api/admin',
  authLimiter,
  adminAuthRoutes
)

app.use(
  '/api/upload',
  uploadRoutes
)

app.use(
  '/api/stripe',
  stripeRoutes
)

/* IMPORTANT — MAIN ROUTES */

app.use('/api', userProductRoutes)
app.use('/api', adminProductRoutes)

app.use('/api', userUserRoutes)
app.use('/api', adminUserRoutes)

app.use('/api', userOrderRoutes)
app.use('/api', adminOrderRoutes)

app.use('/api', wishlistRoutes)



app.use('/api/cart', cartRoutes)



app.use((req, res) => {

  console.log(
    ` Route not found: ${req.method} ${req.url}`
  )

  res.status(404).json({
    message: `Route ${req.url} not found`
  })

})


app.use((err, req, res, next) => {

  console.error(
    "Unhandled Error:",
    err.stack
  )

  res.status(500).json({
    message: err.message
  })

})


const PORT =
  process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(
    `🚀 Server running on port ${PORT}`
  )
)