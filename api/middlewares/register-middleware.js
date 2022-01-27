
function sanitizeUsername(req, res, next) {
    //capitalize username
    let username = req.body.username
    let capitalizedUsername = "";
    for (let i = 0; i < username.length; i++) {
        if (i === 0) {
        capitalizedUsername += username[i].toUpperCase();
        } else {
        capitalizedUsername += username[i].toLowerCase();
        }
    }
    req.body.username = capitalizedUsername
    
    next()
}

function registerVerification(req, res, next) {
    if(!req.body.username || !req.body.password || !req.body.email || !req.body.favoriteGen){
        next({ status: 422, message: 'all form fields required' })
    } else if (req.body.role !== 'Trainer') {
        next({ status: 422, message: 'user role must be equal to trainer' })
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