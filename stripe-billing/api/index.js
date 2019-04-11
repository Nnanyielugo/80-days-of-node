import express from 'express';

import { postStripeCharge } from './controller';

const router = express.Router();

router.post('/', postStripeCharge);

export default router;
