const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Admin = require('../models/adminModel')

const protect = async (req, res, next) => {
  let token

  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      if (decoded.role && ['admin'].includes(decoded.role)) {
        req.admin = await Admin.findById(decoded.id).select('-password')

        if (!req.admin || !req.admin.isActive) {
          return res.status(401).json({ message: 'Admin account not found or inactive' })
        }

        req.user = { _id: req.admin._id, role: req.admin.role }
      } else {
        req.user = await User.findById(decoded.id).select('-password')

        if (!req.user) {
          return res.status(401).json({ message: 'User not found' })
        }

        const now = new Date();
        if (!req.user.lastActive || (now - req.user.lastActive > 60000)) {
           await User.findByIdAndUpdate(req.user._id, { lastActive: now, isOnline: true });
        }
      }

      return next()
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      return next()
    }

    return res.status(403).json({
      message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
    })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user && ['admin'].includes(req.user.role)) {
    return next()
  }
  return res.status(403).json({ message: 'Admin access only' })
}

const adminProtect = async (req, res, next) => {
  let token

  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' })
      }

      req.admin = await Admin.findById(decoded.id).select('-password')
      if (!req.admin || !req.admin.isActive) {
        return res.status(401).json({ message: 'Admin account not found or inactive' })
      }

      req.user = { _id: req.admin._id, role: req.admin.role }
      return next()
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, admin token failed' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no admin token' })
  }
}

module.exports = { protect, requireRole, adminOnly, adminProtect }