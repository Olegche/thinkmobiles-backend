const User = require('../models/user')


const sendJSONResponse = (res, status, content) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(status).json(content);
}

const checkRequestBody = (req, res, next) => {
    if (!req.body ) {
        sendJSONResponse(res, 400, {
            message: "No data"
        })
        return
    }
    next();
} 
module.exports.getUsers = function (req, res) {
    const filter = req.body.filter || {}
    User.find(filter)
        .exec((err, users) => {
            if (err) {
                sendJSONResponse(res, 404, {
                    message: "users not found"
                })
                return
            }
            if (users.length == 0) {
                sendJSONResponse(res, 404, {
                    message: "users not found (empty)"
                })
                return
            }
            sendJSONResponse(res, 200, users)
        })
}

module.exports.getUserById = function (req, res) {
    if (req.params && req.params.user_id) { ///
        User
            .findById(req.params.user_id, (err, user) => { ///
                if (err) {
                    sendJSONResponse(res, 404, {
                        message: 'user not found'
                    });
                    return
                }
                sendJSONResponse(res, 200, user)
            })
    }
}

module.exports.addUser = checkRequestBody, async function (req, res) {
    const newUser = new User({

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        events: req.body.events,

    })

    try {
        await newUser.save(sendJSONResponse(res, 200, {
            message: 'added'
        }))

        console.log(newUser);

    } catch (err) {
        sendJSONResponse(res, 500, {
            message: ` error is: ${err}`
        })
        console.log(`${err}`);

    }
}

module.exports.updateUser = checkRequestBody, async function (req, res, next) {
    if (req.body._id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.body._id, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                description: req.body.description,
                events: req.body.events,
            }, {new: true})
            if (!updatedUser) {
                sendJSONResponse(res, 404, {message: 'User not found'});
                return;
            }
            sendJSONResponse(res, 200, updatedUser);
        } catch (e) {
            console.log(e);
            sendJSONResponse(res, 500, {message: 'Error updating user'});
        }
    } else {
        next();
    }
}


