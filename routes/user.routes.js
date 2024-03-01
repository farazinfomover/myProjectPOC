const express = require("express");
const router = express.Router();
const { checkUserAuth } = require("../utils/auth-middleware");

const { userRegistrationValidator,
    userLoginValidator,
    sendUserPasswordResetEmailValidator,
    changeUserPasswordValidator,
    userPasswordResetValidator } = require("../validators/userValidator");
    
const { userRegistration,
    userLogin, changeUserPassword,
    loggedUser, sendUserPasswordResetEmail,
    userPasswordReset } = require('../controller/user.controller');

// Route Level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)



// Public Routes
router.post("/userRegistration", userRegistrationValidator, userRegistration);
router.get('/userLogin', userLoginValidator, userLogin);
router.post('/send-reset-password-email', sendUserPasswordResetEmailValidator, sendUserPasswordResetEmail);
router.post('/reset-password/:id/:token', userPasswordResetValidator, userPasswordReset)



// Protected Routes
router.patch('/changepassword', changeUserPasswordValidator, changeUserPassword);
router.get('/loggeduser', loggedUser);


module.exports = router;
