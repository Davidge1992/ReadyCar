const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (req, res, next) => {
  if (req.method === 'Opciones') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    if (!token) {
      throw new Error('Autenticación Fallida');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.error({msg: 'Autenticación Fallida'});
    return next(error);
  }
};
