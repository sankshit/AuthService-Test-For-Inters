const { createApp } = require('./app');

const port = process.env.PORT || 3000;
createApp().listen(port, () => {
  console.log(`AuthService listening on http://localhost:${port}`);
});
