import express from 'express';
import helmet from 'helmet';

const app = express();
const port = 5003;
const isProduction = process.env.env.NODE_ENV === 'production';

app.use(helmet())

// error handlers
app.use((req, res, next), () => {
  const error = new Error('Not Found!');
  error.status = 400;
  next(error);
});

// development error handler
if (!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
app.use(( err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.set('port', process.env.PORT || port);
const server = app.listen(app.get('port'), () => {
  console.log('Express app listening on ' + server.address().port);
});