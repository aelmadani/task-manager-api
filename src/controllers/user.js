const User = require('../models/user');
const Task = require('../models/task');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');

exports.postUser = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token }); // toJSON will be called automatically
  } catch (e) {
    res.status(400);
    res.send(e);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token }); // toJSON will be called automatically
  } catch (e) {
    res.status(400).send();
  }
};

exports.postLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

exports.postLogoutAll = async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

exports.getProfile = async (req, res) => {
  res.send(req.user); // toJSON will be called automatically
};

exports.patchUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return res.status(404).send({ error: 'Invalid update' });
  }

  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    // const user = await User.findById(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    res.send(req.user);
  } catch (e) {
    res.status(400).send();
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name);

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
};

exports.postAvatar = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.user.avatar = buffer;

  await req.user.save();
  res.send();
};

exports.deleteAvatar = async (req, res) => {
  console.log('Test');
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
};

exports.getAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
};
