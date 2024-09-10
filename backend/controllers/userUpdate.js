const User = require('../models/User');
const { errorHandler } = require('../utils/error');
const bcryptjs = require('bcryptjs');



// Update User
exports.updateUser = function (req, res, next) {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    )
      .then(function (updatedUser) {
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
      })
      .catch(function (error) {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

// Delete User
exports.deleteUser = function (req, res, next) {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    User.findByIdAndDelete(req.params.id)
      .then(function () {
        res.status(200).json('User has been deleted...');
      })
      .catch(function (error) {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};