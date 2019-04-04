import mongoose from 'mongoose';
import { DB_URI as uri } from '~/config/config';

mongoose.connect(uri);
mongoose.set('debug', true);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to: ${uri}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

import './model';
