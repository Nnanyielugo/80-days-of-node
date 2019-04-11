import express from 'express';
import helmet from 'helmet';
import path from 'path';
import logger from 'morgan';
import { host, port } from 'config';

import { configureCors } from './configure';
import api from './index';

const app = express();
configureCors(app);
const isProd = process.env.NODE_ENV === 'production';

app.set('port', process.env.PORT || port);

app.use(helmet());
if (!isProd) {
  app.use(logger('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// error handlers
app.use((_, __, next) => {
  const error = new Error('Not Found!');
  error.status = 400;
  next(error);
});

// development error handler
if (!isProd) {
  app.use((err, _, res) => {
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
app.use((err, _, res) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

const server = app.listen(app.get('port'), (error) => {
  if (error) throw error;
  // eslint-disable-next-line no-console
  console.log(`Express server started \nListening on ${host}:${server.address().port}`);
});
