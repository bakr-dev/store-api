const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  //  first, validate data
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide name, email and password');
  }

  // if data is ok
  const user = await User.create({ ...req.body });
  const token = user.creatJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  //  first, validate data
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Sorry, we could not find your email.');
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Wrong password!');
  }
  const token = user.creatJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
