const express = require('express');
const authController = require('../app/http/controllers/auth/AuthController');
const verifyJwtToken = require("../app/http/middlewares/VerifyJwtToken");

const router = express.Router();

router.post('/register',authController.register);
router.post('/login', authController.login);
router.get('/verification/get-activation-email', verifyJwtToken, authController.getActivationEmail);
router.get('/verification/verify-account/:userId/:secretCode',authController.verifyAccount);
router.post('/password-reset/get-code',authController.passWordResetGetCode);
router.post('/password-reset/verify',authController.passWordResetVerify);
router.post('/logout',verifyJwtToken, authController.logout);
router.post('/delete-account', verifyJwtToken, authController.deleteAccount )




module.exports = router;