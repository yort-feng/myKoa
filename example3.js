const MyKoa = require('./application');

const app = new MyKoa();

app.use(async (ctx, next) => {
  console.log('middleware1 is running...');
  ctx.body = {};
  await next();
  console.log('middleware1 stopped...');
});
app.use(async (ctx, next) => {
  console.log('middleware2 is running...');
  ctx.body.name = `${ctx.query.name}`;
  await next();
  console.log('middleware2 stopped...');
});
app.use(async (ctx, next) => {
  console.log('middleware3 is running...');
  ctx.body.age = `${ctx.query.age}`;
  await next();
  console.log('middleware3 stopped...');
});
app.listen(8000, () => {
  console.log('Application is running and listening to 8000');
});
