const express = require('express');
const router = express.Router();
const userController = require('../controllers/userUpdate');
const {verifyToken}=require('../utils/verifymiddleware')
router.put('/update/:id',userController.updateUser);

router.delete('/delete/:id',verifyToken, userController.deleteUser);

module.exports = router;