function userObjectVerification(req, res, next) {
    if (!req.body.user_role) {
        next({ status:422, message: 'user_role required' })
    }
    if (!req.body.user_name){
        next({ status: 422, message: 'user_name required.' })
    }
    if (req.body.user_role !== 'Trainer' || req.body.role !== 'Vendor') {
        next({ status: 422, message: 'user_role must be equal to Trainer or Vendor' })
    }
    if(req.body.user_name.length < 4) {
        next({ status: 422, message: 'user_name must be at least 4 characters in length' })
    }
    if (req.body.user_role === 'Trainer') {
        if (!req.body.password) {
            next ({ status:422, message: 'user_password required' })
        }
        if(req.body.user_password.length < 7) {
            next({ status: 422, message: 'user_password must be at least 7 characters in length' })
        }
        if (!req.body.user_email){
            next({ status: 422, message: 'user_email required.' })
        }
    }
    let email = req.body.user_email
    let containsAtSign = email.search('@')
    let containsDotCom = email.search('.')
    if (containsAtSign == -1 || containsDotCom == -1) {
        next({ status: 400, message: 'user_email is not in the proper format' })
    }
    next()
}

function sanitizeUsername(req, res, next) {
    //remove extra spaces, letter casing uneffected
    let trimmedUsername = req.body.user_name.trim()
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
    req.body.user_name = singleSpacesUsername
    next()
}

module.exports = {
    userObjectVerification,
    sanitizeUsername
}