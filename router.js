const path = require('path');

const {
  getCalendarEvents,
  getToken,
  handleAuth,
  handleAuthCallBack,
  handleLogOut,
} = require('./server/controllers');

module.exports = (app) => {
  app.get('/calendar-events', getCalendarEvents);
  app.get('/token', getToken)
  app.get('/auth', handleAuth);
  app.get('/oauth2callback', handleAuthCallBack);
  app.get('/logout', handleLogOut);
  app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/client/build/index.html')));
};