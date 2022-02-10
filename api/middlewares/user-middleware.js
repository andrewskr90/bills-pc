
function sanitizeUsername(req, res, next) {
    //capitalize username
    if (req.body.user_name) {
        let username = req.body.user_name
        let capitalizedUsername = "";
        for (let i = 0; i < username.length; i++) {
            if (i === 0) {
            capitalizedUsername += username[i].toUpperCase();
            } else {
            capitalizedUsername += username[i].toLowerCase();
            }
        }
        req.body.user_name = capitalizedUsername
    }
    next()
}

function updateVerification(req, res, next) {
    if (req.body.user_role) {
        if (req.body.user_role !== 'Trainer') {
            next({ 
                status: 422, 
                message: 'user_role must be equal to trainer' 
            })
        }
    } if (req.body.user_name) {
        if(req.body.user_name.length < 4) {
            next({ 
                status: 422, 
                message: 'user_name must be at least 4 characters in length' 
            })
        }
    }
    next()
}

function checkEmailFormat(req, res, next) {
    let email = req.body.user_email
    let containsAtSign = email.search('@')
    let containsDotCom = email.search('.')
    if (containsAtSign == -1 || containsDotCom == -1) {
        next({ status: 400, message: 'user_email is not in the proper format' })
    } else {
        next()
    }
}



module.exports = {
    sanitizeUsername,
    updateVerification,
    checkEmailFormat
}