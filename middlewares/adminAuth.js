const adminAuth = (req, res, next) => {
  const { role } = req.user;

  if (!role) {
    res.status(500).json({ message: 'Please Login Again, Role not Found' });
  }
  if (role == 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'You are not Authorized for Admin Operations' });
  }
};
module.exports = adminAuth;
