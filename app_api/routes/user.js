// const express =require('express')
// const router = express.Router()
// const ctrUser = require('../controllers/users1')
const bodyParser = require("body-parser");
// const urlencodedParser = bodyParser.urlencoded({
//     extended: false
// });

// router.get('/',ctrUser.getUsers);
// router.get('/:user_id',ctrUser.getUserById);
// router.post('/add', urlencodedParser, ctrUser.addUser)
// router.put('/update',urlencodedParser, ctrUser.updateUser)

const express = require('express');
const router = express.Router();
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
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', (req, res) => {
    const filter = req.body.filter || {}
    User.find(filter)
        .then((users) => {
            if (users.length === 0) {
                sendJSONResponse(res, 404, {
                    message: "users not found (empty)"
                })
                return
            }
            sendJSONResponse(res, 200, users)
        })
        .catch((err) => {
            sendJSONResponse(res, 404, {
                message: "users not found"
            })
        })
})

router.get('/:user_id', (req, res) => {
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
})

router.post('/add', bodyParser.urlencoded({extended: false}),  checkRequestBody, async (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        events: req.body.events,
    })

    try {
        await newUser.save()
        sendJSONResponse(res, 200, {
            message: 'added'
        })
        console.log(newUser);
    } catch (err) {
        sendJSONResponse(res, 500, {
            message: ` error is: ${err}`
        })
        console.log(`${err}`);
    }
})

router.put('/update', bodyParser.urlencoded({extended: false}),  checkRequestBody, async (req, res, next) => {
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
})

router.post('/:user_id/events', bodyParser.json(), checkRequestBody, async (req, res) => {
  const eventData = req.body;
  if (!eventData.eventTitle) {
    sendJSONResponse(res, 400, {message: "Missing event title"});
    return;
  }
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      sendJSONResponse(res, 404, {message: "User not found"});
      return;
    }
    const newEvent = { 
      eventId: eventData.eventId,
      eventTitle: eventData.eventTitle,
      eventDescription: eventData.eventDescription,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
    };
    user.events.push(newEvent);
    await user.save();
    sendJSONResponse(res, 200, {message: "Event added to user"});
  } catch (err) {
    sendJSONResponse(res, 500, {message: `Error adding event: ${err}`});
  }
});

  
  
  



module.exports = router;
