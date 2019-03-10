const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const redis = require('redis').createClient(process.env.REDIS_URL || 'redis://localhost:6379');

const keys = require('./oauth2.keys.json'); // for local testing dev
const { parseEventsData } = require('./utils');

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID || keys.web.client_id,
  process.env.CLIENT_SECRET || keys.web.client_secret,
  process.env.REDIRECT_URL || keys.web.redirect_uris[1]
);

redis.on('ready', () => console.log("Redis is ready"));
redis.on('error', () => console.log("Error in Redis"));

const handleAuth = (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
  });

  res.redirect(authorizeUrl);
};

const handleAuthCallBack = async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);

  oAuth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, data) => {
    if (err) return console.log(`The API returned an error: ${err}`);
    const events = parseEventsData(data.data.items);

    redis.set(tokens.access_token, JSON.stringify(events));
    redis.set('token', tokens.access_token);

    res.redirect(process.env.REDIRECT_UI_URL || 'http://localhost:3000');
  });
};

const handleLogIn = (req, res) => {
  redis.get('token', (err, token) => {
    if (err) throw err;

    token ? res.send({ isAuth: true }) : res.send({ isAuth: false });
  })
};

const handleLogOut = (req, res) => {
  redis.del('token', (err, token) => {
    if (err || !token) throw err;

    token === 1 ? res.send({ isAuth: false }) : console.log("Does't exists");
  });
};

const getCalendarEvents = (req, res) => {
  redis.get('token', (tokenErr, token) => {
    if (tokenErr || !token) {
      return res.send({ message: 'Unauthorized access.' });
    } 

    redis.get(token, (eventErr, events) => {
      res.send(JSON.parse(events));
    })
  });
};


module.exports = {
  getCalendarEvents,
  handleAuth,
  handleAuthCallBack,
  handleLogIn,
  handleLogOut,
}