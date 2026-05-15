const ROLE_HIERARCHY = {
  'user': 1,
  'admin': 3
};

const checkRole = (...roles) => {
  return (req, res, next) => {

    const userRole = req.user?.role || 'user';

    if (roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      message: `Access denied. Required roles: ${roles.join(', ')}. Your role: ${userRole}`
    });
  };
};
  
const checkRoleLevel = (minimumRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role || 'user';
    const userLevel = ROLE_HIERARCHY[userRole] || 1;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] || 3;

    if (userLevel >= requiredLevel) {
      return next();
    }

    return res.status(403).json({
      message: `Insufficient permissions. Required level: ${minimumRole} or higher. Your role: ${userRole}`
    });
  };
};

module.exports = { checkRole, checkRoleLevel, ROLE_HIERARCHY };
