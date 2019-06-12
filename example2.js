const MyKoa = require('./application');

const app = new MyKoa();

app.use(async (ctx) => {
  ctx.body = `Hello ${ctx.query.name}, welcome!`;
});
app.listen(8000, () => {
  console.log('Application is running and listening to 8000');
});
