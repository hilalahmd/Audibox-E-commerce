

const Admin = require("../../models/adminModel");
  const jwt = require('jsonwebtoken');


  const generateAdminToken = (adminId) => {
    return jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '30m' 
    });
  };

  const generateAdminRefreshToken = (adminId) => {
    return jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
  };
 
  const loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Admin account is deactivated' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAdminToken(admin._id);
    const refreshToken = generateAdminRefreshToken(admin._id);

   
    admin.refreshToken = refreshToken;
    await admin.save();

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000 
    });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    
    res.json({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      token: accessToken
    });

  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};

const refreshAdminAccessToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).json({ message: 'Unauthorized, no refresh cookie provided' });
    }

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Forbidden, session expired permanently' });
        }

        const foundAdmin = await Admin.findById(decoded.id);
        if (!foundAdmin) {
          return res.status(401).json({ message: 'Unauthorized, admin missing' });
        }

        if (foundAdmin.refreshToken !== refreshToken) {
          return res.status(403).json({ message: 'Forbidden, token mismatch or revoked' });
        }

        if (!foundAdmin.isActive) {
          return res.status(403).json({ message: 'Admin account not active' });
        }

        const accessToken = generateAdminToken(foundAdmin._id);
        const newRefreshToken = generateAdminRefreshToken(foundAdmin._id);

        foundAdmin.refreshToken = newRefreshToken;
        await foundAdmin.save();

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 60 * 1000
        });

        res.cookie('jwt', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ token: accessToken });
      }
    );
  } catch (err) {
    console.error('Admin refresh error:', err);
    res.status(500).json({ message: 'Server error during admin token refresh' });
  }
};


const createAdmin = async (req, res) => {
  try {
    const { email, password, role = 'admin' } = req.body;

  
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const admin = await Admin.create({
      email: email.toLowerCase(),
      password,
      role
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      }
    });

  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ message: err.message });
  }
};


const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { loginAdmin, refreshAdminAccessToken, createAdmin, getAdminProfile };