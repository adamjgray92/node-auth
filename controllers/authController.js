const User = require('../models/User');

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
      return res.status(400).send('Error, user not created');
    }
  },
  loginGet: (req, res) => {
    res.render('login');
  },
  loginPost: async (req, res) => {},
};
