const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const redis = require('redis');

// const keys = require('../oauth2.keys.json'); // for local testing dev
const { parseEventsData } = require('../utils');

const redisClient = redis.createClient({ host: process.env.REDIS_SERVER || 'localhost', port: 6379 });
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID || keys.web.client_id,
  process.env.CLIENT_SECRET || keys.web.client_secret,
  process.env.REDIRECT_URL || keys.web.redirect_uris[1]
);

redisClient.on('ready', () => console.log("Redis is ready"));
redisClient.on('error', () => console.log("Error in Redis"));

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

  redisClient.set('tokens', JSON.stringify(tokens));
  res.redirect(process.env.REDIRECT_UI_URL || 'http://localhost:3000')
};

const getToken = (req, res) => {
  redisClient.get('tokens', (error, tokens) => {
    if (error || !tokens) res.send({ token: false })
    if (tokens) res.send({ token: true })
  });
};

const handleLogOut = (req, res) => {
  redisClient.del('tokens', (err, token) => {
    if (!err) {
      if (token === 1) {
        console.log("Key is deleted");
        res.send({ token: false })
      } else {
        console.log("Does't exists");
      }
    }
  });
};

const getCalendarEvents = (req, res) => {
  redisClient.get('tokens', (error, tokens) => {
    if (error) throw error;

    oAuth2Client.setCredentials(JSON.parse(tokens));
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
      res.send([...events]);
    });
  });
};


module.exports = {
  getCalendarEvents,
  getToken,
  handleAuth,
  handleAuthCallBack,
  handleLogOut,
}