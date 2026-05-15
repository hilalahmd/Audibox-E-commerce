const User = require('../../models/userModel')

const Admin = require('../../models/adminModel')

const jwt = require('jsonwebtoken')


const generateAccessToken = (id) => {

  return jwt.sign({ id }, process.env.JWT_SECRET, {

    expiresIn: '15m' 

  })

}

const generateRefreshToken = (id) => {

  
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {

    expiresIn: '7d'

  })

}

const registerUser = async (req, res) => {

  try {

    
    const { username, email, password } = req.body


    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    
    const emailRegex = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long, and include both uppercase and lowercase letters.' })
    }

    const userExists = await User.findOne({ email })

    if (userExists) {

      return res.status(400).json({ message: 'Email already registered' })

    }

    const user = new User({ username, email, password })


    await user.save()


    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);


    user.refreshToken = refreshToken;

    await user.save();


    res.cookie('accessToken', accessToken, {

      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'strict',

      maxAge: 15 * 60 * 1000 

    });

    res.cookie('jwt', refreshToken, {

      httpOnly: true, 

      secure: process.env.NODE_ENV === 'production', 

      sameSite: 'strict', 

      maxAge: 7 * 24 * 60 * 60 * 1000 

    });

    return res.status(201).json({

      _id: user._id,

      id: user._id, 
 
      username: user.username,
 
      email: user.email,
 
      isBlocked: user.isBlocked,
 
      role: user.role,
 
      wishlist: user.wishlist,
 
      cart: user.cart,
 
      token: accessToken
 
    })

  } catch (err) {

    console.error('Register error:', err)
 
    return res.status(500).json({ message: err.message })
 
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    let user = await User.findOne({ email })
    let isAdmin = false;

    if (!user) {
      user = await Admin.findOne({ email: email.toLowerCase() })
      if (user) {
        isAdmin = true;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    if (isAdmin) {
      if (!user.isActive) {
        return res.status(403).json({ message: 'Admin account is deactivated' })
      }
    } else {
      if (user.isBlocked) {
        return res.status(403).json({ message: 'Your access has been restricted' })
      }
      user.isOnline = true
    }

    let accessToken, refreshToken;
    if (isAdmin) {
      accessToken = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '30m' });
      refreshToken = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
    } else {
      accessToken = generateAccessToken(user._id);
      refreshToken = generateRefreshToken(user._id);
    }

    user.refreshToken = refreshToken
    await user.save()

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: isAdmin ? 30 * 60 * 1000 : 15 * 60 * 1000 
    });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    return res.json({
      _id: user._id,
      id: user._id,
      username: isAdmin ? "Admin" : user.username,
      email: user.email,
      isBlocked: isAdmin ? false : user.isBlocked,
      isActive: isAdmin ? user.isActive : true,
      role: isAdmin ? (user.role || 'admin') : user.role,
      wishlist: isAdmin ? [] : user.wishlist,
      cart: isAdmin ? [] : user.cart,
      token: accessToken
    })

  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: err.message })
  }
}

const logoutUser = async (req, res) => {

  try {

    const id = req.body?.id || req.user?._id

    let foundAccount = null


    if (id) {

      foundAccount = await User.findById(id)

      if (!foundAccount) {

        foundAccount = await Admin.findById(id)

      }
    }

    if (foundAccount) {

      if (typeof foundAccount.isOnline !== 'undefined') {

        foundAccount.isOnline = false

      }
      if (typeof foundAccount.refreshToken !== 'undefined') {

        foundAccount.refreshToken = ''

      }
      await foundAccount.save()

    }

    res.clearCookie('accessToken', {

      httpOnly: true,

      sameSite: 'strict',

      secure: process.env.NODE_ENV === 'production'

    })


    res.clearCookie('jwt', {

      httpOnly: true,

      sameSite: 'strict',

      secure: process.env.NODE_ENV === 'production'

    })


    return res.json({ message: 'Logged out successfully' })

  } catch (err) {

    console.error('Logout error:', err)

    return res.status(500).json({ message: err.message })

  }
}

const refreshAccessToken = async (req, res) => {

  try {

    const cookies = req.cookies;


    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized, no refresh cookie provided' });

    const refreshToken = cookies.jwt;


    jwt.verify(

      refreshToken,

      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,

      async (err, decoded) => {

        
        if (err) return res.status(403).json({ message: 'Forbidden, session expired permanently' });


        const foundUser = await User.findById(decoded.id);

        if (!foundUser) return res.status(401).json({ message: 'Unauthorized, account missing' });


        if (foundUser.refreshToken !== refreshToken) {

          return res.status(403).json({ message: 'Forbidden, token mismatch or revoked' });

        }

        const accessToken = generateAccessToken(foundUser._id);

        const newRefreshToken = generateRefreshToken(foundUser._id);


        foundUser.refreshToken = newRefreshToken;

        await foundUser.save();


        res.cookie('accessToken', accessToken, {

          httpOnly: true,

          secure: process.env.NODE_ENV === 'production',

          sameSite: 'strict',

          maxAge: 15 * 60 * 1000 

        });

        res.cookie('jwt', newRefreshToken, {

          httpOnly: true,

          secure: process.env.NODE_ENV === 'production',

          sameSite: 'strict',

          maxAge: 7 * 24 * 60 * 60 * 1000 

        });

        res.json({ token: accessToken });

      }
    );
  } catch (err) {

    res.status(500).json({ message: err.message });

  }
}

module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken }