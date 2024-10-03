const { verifyToken } = require('../utils/token');

const authenticate = async (req, res, next) => {
  const token = req.cookies.tokenId;

  if (!token) {
    return res.status(401).json({
      err: 'Unauthorized - Token not found',
      msg: 'Please Login First',
    });
  }

  try {
    const data = await verifyToken(token);
    console.log('The data from token is ', data);
    req.user = data;
    next();
  } catch (error) {
    console.log('Unauthenticated Request');
    res.status(401).json({ message: error.message });
  }
};

module.exports = authenticate;
