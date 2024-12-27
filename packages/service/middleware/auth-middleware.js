const CryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')
const { v4: uuidV4 } = require('uuid')

const isOnlyLetters = (string) => {
    return /^[a-zA-Z]+$/.test(string)
}

const checkRegisterValues = (req, res, next) => {
    const { user_name, user_email, user_password, repeat_user_password, user_favorite_gen } = req.body.user

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
    const { user_name, user_email, user_password, user_favorite_gen } = req.body.user

    const formattedUser = {
        user_id: uuidV4(),
        user_name,
        user_password,
        user_role: 'Trainer',
        user_email,
        user_favorite_gen
    }
    req.body.user = formattedUser
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
    const issuedAt = Date.now()
    const expiration = issuedAt + 1000*60*60*24
    const claims = {
        user_id: user_id,
        user_name: user_name,
        user_role: user_role,
        user_email: user_email,
        user_favorite_gen: user_favorite_gen,
        created_date: created_date,
        modified_date: modified_date,
        iat: issuedAt,
        exp: expiration
    }
    req.claims = claims
    const sessionString = JSON.stringify(claims)
    const encryptedSessionString = CryptoJS.AES.encrypt(sessionString, process.env.JWT_SECRET).toString()
    req.sessionToken = encryptedSessionString
    next()
}

const encryptSessionCookie = (req, res, next) => {
    const cookieOptions = {
        signed: true,
        httpOnly: true
    }
    res.cookie('billsPcSession', req.sessionToken, cookieOptions)
    next()
}

const verifyCookie = async (req, res, next) => {
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
    req.sessionToken = parsedCookies.billsPcSession
    next()
}

const decodeSessionToken = async (req, res, next) => {
    const bytes = CryptoJS.AES.decrypt(req.sessionToken, process.env.JWT_SECRET)
    const decryptedSessionString = bytes.toString(CryptoJS.enc.Utf8)
    req.claims = JSON.parse(decryptedSessionString)
    //check if session is expired
    const currentDate = Date.now()
    if (req.claims.exp < currentDate) {
        return next({
            status: 419,
            message: 'Session expired.'
        })
    } else {
        //refresh expiration of session
        const expiration = currentDate + 1000*60*60*24
        req.claims = {
            ...req.claims,
            iat: currentDate,
            exp: expiration
        }
        next()
    }
}

const gymLeaderOnly = async (req, res, next) => {
    if (req.claims.user_role !== 'GymLeader') {
        return next({ message: 'Unauthorized.'})
    }
    next()
}

const encryptPassword = (req, res, next) => {
    const rounds = 10
    bcrypt.hash(req.body.user.user_password, rounds, (err, hash) => {
        if (err) {
            return next(err)
        } else {
            req.body.user.user_password = hash
            next()
        }
    })
}

const authenticateUser = (req, res, next) => {
    const resultUser = req.results[0]
    const password = req.body.user.user_password
    const hash = resultUser.user_password
    bcrypt.compare(password, hash, (err, result) => {
        if (err) {
            return next(err)
        } else if (!result) {
            return next({ message: 'Incorrect username and password.' })
        } else {
            req.user = resultUser
            next()
        }
    })
}

module.exports = {
    formatUser,
    createSession,
    encryptSessionCookie,
    verifyCookie,
    decodeSessionToken, 
    encryptPassword, 
    authenticateUser,
    checkRegisterValues,
    gymLeaderOnly
}
