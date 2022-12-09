const jwt = require('jsonwebtoken')

module.exports = { 
   checkAuth : (req,res,next) => {
  // Is headerio reikia issitraukti tokena
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
  if(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // Adding token
      req.userId = decoded.id
      next()
    } catch (error) {
      return res.json({message: 'No access for you'})
    }
  } else {
    return res.json({message: 'No access for you'})
  }
}
}