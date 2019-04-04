import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import logger from 'morgan';

import './api/db';
import './api/auth/passport';
import api from './api/';

const app = express();
const port = process.env.PORT || 5003;
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', api);

// error handlers
app.use((req, res, next) => {
  const error = new Error('Not Found!');
  error.status = 400;
  next(error);
});

// development error handler
if (!isProduction) {
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.set('port', port);
const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Express app listening on ${server.address().port}`);
});

export default app;
