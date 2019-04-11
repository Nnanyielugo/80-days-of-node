import cors from 'cors';
import bodyParser from 'body-parser';
import stripe from 'stripe';
import { frontend_url, stripe_key } from 'config';

const corsOptions = {
  // eslint-disable-next-line no-confusing-arrow
  origin: (origin, callback) =>
    frontend_url.indexOf(origin) !== -1
      ? callback(null, true)
      : callback(new Error('Not allowed by cors')),
};

export const configureCors = (app) => {
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
};

export const configureStripe = stripe(stripe_key);
