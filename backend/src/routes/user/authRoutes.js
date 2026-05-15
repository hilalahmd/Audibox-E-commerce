const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
} = require('../../controllers/user/authController')

const { protect } = require('../../middleware/authMiddleware')
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)
router.post('/logout', protect, logoutUser)
router.get('/check/:id', protect, async (req, res) => {
  try {
    const User = require('../../models/userModel')

    const user = await User.findById(req.params.id)

    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ isBlocked: user.isBlocked })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
