const MyKoa = require('./application');

const app = new MyKoa();

app.use((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('sucessed');
});
app.listen(8000, () => {
  console.log('Application is running and listening to 8000');
});
