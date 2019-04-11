import { configureStripe as stripe } from '../configure';

// eslint-disable-next-line import/prefer-default-export
export const postStripeCharge = (req, res, next) => {
  stripe.charges.create(req.body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      next(stripeErr);
    } else {
      res.status(200).json({ sucess: stripeRes });
    }
  });
};
