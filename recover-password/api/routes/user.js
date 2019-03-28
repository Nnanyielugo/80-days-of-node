import express from 'express';

import auth from '../auth/auth';
import { login, signup, getUser, forgotpwd } from '../controllers/user';

const router = express.Router();

router.get('/user', auth.required, getUser);
router.post('/', signup);
router.post('/login', login)
router.post('/forgot', forgotpwd)

export default router;