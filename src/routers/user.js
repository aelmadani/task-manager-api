const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');

const userController = require('../controllers/user');

router.post('/users', userController.postUser);

router.post('/users/login', userController.postLogin);

router.post('/users/logout', auth, userController.postLogout);

router.post('/users/logoutAll', auth, userController.postLogoutAll);

router.get('/users/me', auth, userController.getProfile);

router.patch('/users/me', auth, userController.patchUser);

router.delete('/users/me', auth, userController.deleteUser);

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error('File have incorrect type'));
    }
    cb(undefined, true);
  }
});

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  userController.postAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete('/users/me/avatar', auth, userController.deleteAvatar);
router.get('/users/:id/avatar', auth, userController.getAvatar);
module.exports = router;
