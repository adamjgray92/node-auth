const User = require('../models/User');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {};

  if (err.code === 11000) {
    errors.email = 'Email is already registered';
  }

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach((error) => {
      const { path, message } = error.properties;
      errors[path] = message;
    });
  }

  return errors;
};

module.exports = {
  signUpGet: (req, res) => {
    res.render('signup');
  },
  signUpPost: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.create({
        email,
        password,
      });
      return res.status(201).json(user);
    } catch (err) {
      const errors = handleErrors(err);
      return res.status(400).json({ errors });
    }
  },
  loginGet: (req, res) => {
    res.render('login');
  },
  loginPost: async (req, res) => {},
};
