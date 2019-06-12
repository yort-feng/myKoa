const MyKoa = require('./application');

const app = new MyKoa();

app.use(async () => {
  throw new Error('ooops');
});

app.on('error', err => console.log(`${err.stack}`));

app.listen(8000, () => {
  console.log('Application is running and listening to 8000');
});
