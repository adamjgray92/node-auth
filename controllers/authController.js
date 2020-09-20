const jwt = require('jsonwebtoken');

const User = require('../models/User');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {};

  if (err.message === 'Login details are incorrect') {
    errors.email = 'Login details are incorrect';
  }

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

const createToken = (id) => {
  return jwt.sign({ id }, 'secret', { expiresIn: 3 * 24 * 60 * 60 });
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

      const token = createToken(user._id);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({ user: user._id });
    } catch (err) {
      const errors = handleErrors(err);
      return res.status(400).json({ errors });
    }
  },
  loginGet: (req, res) => {
    res.render('login');
  },
  loginPost: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.login(email, password);

      if (user) {
        const token = createToken(user._id);

        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({ user: user._id });
      }
    } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({ errors });
    }
  },
  logoutGet: (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  },
};
