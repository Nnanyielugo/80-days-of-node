import mongoose from 'mongoose';
import { DB_URI as uri } from '~/config/config';

mongoose.connect(uri);
mongoose.set('debug', true);

mongoose.connection.on('connected', function(){
  console.log(`Mongoose connected to: ${uri}`);
});

mongoose.connection.on('error', function(err) {
  console.log(`Connection error: ${err}`);
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
})

import './models/user';