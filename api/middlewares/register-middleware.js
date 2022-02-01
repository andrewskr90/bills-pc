
function sanitizeUsername(req, res, next) {
    //remove extra spaces, letter casing uneffected
    let trimmedUsername = req.body.username.trim()
    let charArray = trimmedUsername.split('')
    let singleSpacesUsername = ''
    for (let i=0; i< charArray.length; i++) {
        if (charArray[i] === ' ') {
            if (charArray[i+1] === ' ') {
                continue
            }
        }
        singleSpacesUsername += charArray[i]
    }
    req.body.username = singleSpacesUsername
    next()
}

function registerVerification(req, res, next) {
    if(!req.body.username || !req.body.password || !req.body.email || !req.body.favoriteGen){
        next({ status: 422, message: 'all form fields required' })
    } else if (req.body.role !== 'Trainer') {
        next({ status: 422, message: 'user role must be equal to Trainer' })
    } else if(req.body.username.length < 4) {
        next({ status: 422, message: 'Username must be at least 4 characters in length' })
    } else if(req.body.password.length < 7) {
        next({ status: 422, message: 'Password must be at least 7 characters in length' })
    } else {
        next()
    }
}

function checkEmailFormat(req, res, next) {
    let email = req.body.email
    let containsAtSign = email.search('@')
    let containsDotCom = email.search('.')
    if (containsAtSign == -1 || containsDotCom == -1) {
        next({ status: 400, message: 'Email is not in the proper format' })
    } else {
        next()
    }
}



module.exports = {
    sanitizeUsername,
    registerVerification,
    checkEmailFormat
}