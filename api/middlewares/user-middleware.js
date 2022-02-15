function userObjectVerification(req, res, next) {
    if (!req.body.user_name || !req.body.user_password || !req.body.user_email || !req.body.user_favorite_gen){
        next({ status: 422, message: 'all form fields required' })
    } 
    if (req.body.user_role !== 'Gym_Leader') {
        next({ status: 422, message: 'user_role must be equal to Trainer' })
    } 
    if(req.body.user_name.length < 4) {
        next({ status: 422, message: 'user_name must be at least 4 characters in length' })
    } 
    if(req.body.user_password.length < 7) {
        next({ status: 422, message: 'user_password must be at least 7 characters in length' })
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