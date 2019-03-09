const {
  getCalendarEvents,
  getToken,
  handleAuth,
  handleAuthCallBack,
  handleLogOut,
} = require('./controllers');

module.exports = (app) => {
  app.get('/calendar-events', getCalendarEvents);
  app.get('/token', getToken)
  app.get('/auth', handleAuth);
  app.get('/oauth2callback', handleAuthCallBack)
  app.get('/logout', handleLogOut)
};