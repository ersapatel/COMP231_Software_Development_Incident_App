import express from 'express';
import usersCtrl from '../controllers/user.controller.js';

const router = express.Router();

// Define routes
router.get('/', usersCtrl.getAllUsers);
router.get('/:id', usersCtrl.getUserById);
router.post('/', usersCtrl.createUser);
router.put('/:id', usersCtrl.updateUser);
router.delete('/:id', usersCtrl.deleteUserById);
router.delete('/', usersCtrl.deleteAllUsers);

export default router;