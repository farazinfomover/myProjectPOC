const { check, body, param } = require('express-validator');

exports.userRegistrationValidator = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  check('tc').notEmpty().withMessage('Terms and conditions must be accepted')
];

exports.userLoginValidator = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is not valid'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.changeUserPasswordValidator = [
  body('password').notEmpty().withMessage('New Password is required'),
  body('password_confirmation').notEmpty().withMessage('Confirm New Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('New Password and Confirm New Password do not match');
      }
      return true;
    })
];

exports.sendUserPasswordResetEmailValidator = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format')
];

exports.userPasswordResetValidator = [
  param('id').notEmpty().withMessage('User ID is required'),
  param('token').notEmpty().withMessage('Token is required'),
  body('password').notEmpty().withMessage('New Password is required'),
  body('password_confirmation').notEmpty().withMessage('Confirm New Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('New Password and Confirm New Password do not match');
      }
      return true;
    })
];