const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidV4 } = require('uuid')

const isOnlyLetters = (string) => {
    return /^[a-zA-Z]+$/.test(string)
}

const checkRegisterValues = (req, res, next) => {
    const { user_name, user_email, user_password, repeat_user_password, user_favorite_gen } = req.body

    const onlyLetters = isOnlyLetters(user_name)
    
    if (!user_name) {
        return next({ status: 400, message: 'Username required.' })
    } else if (!onlyLetters) {
        return next({ status: 400, message: 'Username can only have letters.'})
    } else if (!user_email) {
        return next({ status: 400, message: 'Email required.' })
    } else if (!user_favorite_gen) {
        return next({ status: 400, message: 'Favorite gen required.' })
    } else if (!user_password) {
        return next({ status: 400, message: 'Password required.' })
    } else if (!repeat_user_password) {
        return next({ status: 400, message: 'Confirm password.' })
    } else if (user_name.length < 3) {
        return next({ status: 400, message: 'Trainer name must be at least 3 letters.' })
    } else if (user_password.length < 7) {
        return next({ status: 400, message: 'Password must be at least 7 characters long.' })
    } else if (user_password !== repeat_user_password) {
        return next({ status: 400, message: 'Passwords do not match.' })
    } 
    next()
}

const formatUser = (req, res, next) => {
    const { user_name, user_email, user_password, user_favorite_gen } = req.body

    const formattedUser = {
        user_id: uuidV4(),
        user_name,
        user_password,
        user_role: 'Trainer',
        user_email,
        user_favorite_gen
    }
    req.user = formattedUser
    next()
}

const createSession = (req, res, next) => {
    const { user_id,
         user_name,
         user_role,
         user_email,
         user_favorite_gen,
         created_date,
         modified_date } = req.user
    const claims = {
        user_id: user_id,
        user_name: user_name,
        user_role: user_role,
        user_email: user_email,
        user_favorite_gen: user_favorite_gen,
        created_date: created_date,
        modified_date: modified_date,
        iat: Date.now()
    }
    req.claims = claims
    const jwtOptions = {
        expiresIn: '8h'
    }
    try {
        const sessionJwt = jwt.sign(claims, process.env.JWT_SECRET, jwtOptions)
        req.sessionJwt = sessionJwt
        next()
    } catch (err) {
        return next(err)
    }
}

const encryptSessionCookie = (req, res, next) => {
    const cookieOptions = {
        signed: true,
        httpOnly: true,
        maxAge: 1000*60*60*2
    }
    res.cookie('billsPcSession', req.sessionJwt, cookieOptions)
    next()
}

const verifySession = async (req, res, next) => {
    const parsedCookies = req.signedCookies
        if (parsedCookies.billsPcSession === undefined) {
            return next({
                status: 401,
                message: 'Missing cookie.'
            })
        }
        if (!parsedCookies.billsPcSession) {
            return next({
                status: 401,
                message: 'Inauthentic cookie.'
            })
        }
        req.sessionJwt = parsedCookies.billsPcSession
        next()
}

const decodeJwt = async (req, res, next) => {
    try {
        console.log(req.sessionJwt)
        const decodedJwt = await jwt.verify(req.sessionJwt, process.env.JWT_SECRET)
        console.log(decodedJwt)
        req.claims = decodedJwt
    } catch (err) {
        return next(err)
    }
    next()
}

const gymLeaderOnly = async (req, res, next) => {
    if (req.claims.user_role !== 'GymLeader') {
        return next({ message: 'Unauthorized.'})
    }
    next()
}

const encryptPassword = (req, res, next) => {
    const rounds = 10
    bcrypt.hash(req.user.user_password, rounds, (err, hash) => {
        if (err) {
            return next(err)
        } else {
            req.user.user_password = hash
            next()
        }
    })
}

const authenticateUser = (req, res, next) => {
    const user = req.users[0]
    const password = req.body.user_password
    const hash = user.user_password
    bcrypt.compare(password, hash, (err, result) => {
        if (err) {
            return next(err)
        } else if (!result) {
            return next({ message: 'Incorrect username and password.' })
        } else {
            req.user = user
            next()
        }
    })
}

const prepUserFilter = (req, res, next) => {
    const preppedFilter = { user_name: req.body.user_name}
    req.preppedFilter = preppedFilter
    next()
}

module.exports = {
    formatUser,
    createSession,
    encryptSessionCookie,
    verifySession,
    decodeJwt, 
    encryptPassword, 
    authenticateUser,
    prepUserFilter,
    checkRegisterValues,
    gymLeaderOnly
}
