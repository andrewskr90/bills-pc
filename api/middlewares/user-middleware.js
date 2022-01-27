
function sanitizeUsername(req, res, next) {
    //capitalize username
    if (req.body.username) {
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
    }
    next()
}

function updateVerification(req, res, next) {
    if (req.body.role) {
        if (req.body.role !== 'Trainer') {
            next({ 
                status: 422, 
                message: 'user role must be equal to trainer' 
            })
        }
    } if (req.body.username) {
        if(req.body.username.length < 4) {
            next({ 
                status: 422, 
                message: 'Username must be at least 4 characters in length' 
            })
        }
    }
    next()
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
    updateVerification,
    checkEmailFormat
}