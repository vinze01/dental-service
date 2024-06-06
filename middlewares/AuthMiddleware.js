const jwt = require("jsonwebtoken")

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")

    if(!accessToken) {
        return res.json({error: 'User not logged in'})
    }

    try {
        const validToken = jwt.verify(accessToken, "d3nt4l0ff1c3")
        req.user = validToken
        if(validToken) {
            return next()
        }
    } catch (error) {
        return res.json({error})
    }
}

module.exports = {validateToken}