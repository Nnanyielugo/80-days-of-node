import express from 'express';

import auth from '../auth/auth';
import { 
  login,
  signup,
  getUser,
  forgotpwd,
  resetToken
} from '../controllers/user';

const router = express.Router();

router.get('/user', auth.required, getUser);
router.post('/', signup);
router.post('/login', login);
router.post('/forgot', forgotpwd);
router.post('/reset/:token', resetToken);

export default router;