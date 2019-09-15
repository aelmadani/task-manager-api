const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const taskController = require('../controllers/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, taskController.postTask);

router.get('/tasks', auth, taskController.getTasks);

router.get('/tasks/:id', auth, taskController.getTask);

router.patch('/tasks/:id', auth, taskController.patchTask);

router.delete('/tasks/:id', auth, taskController.deleteTask);

module.exports = router;
