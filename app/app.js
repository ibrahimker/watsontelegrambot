var debug = require('debug')('app');
var request = require('request');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var BOT_TOKEN;

if (appEnv.isLocal) {
  //put your development BOT Token
  BOT_TOKEN = '187747124:AAEzx09ZjxubNsyhJfccZOM4NzTjxgvWqcE';
  debug('Local run');
} else {
  //Put your production BOT Token
  BOT_TOKEN = '187747124:AAEzx09ZjxubNsyhJfccZOM4NzTjxgvWqcE';
  debug('Container run');
}

var express = require('express');
var http = require('http');
var TelegramBot = require('node-telegram-bot-api');
var startHandler = require('./start');
//add other handlers

//Create Express app to serve client
var app = express();
//Create WebServer
var httpSrv = http.createServer(app);

//Serve public folder statically
app.use(express.static('public'));

//Listen
httpSrv.listen(appEnv.port, '0.0.0.0', function() {
  console.log('server starting on ' + appEnv.url);
});

function exitHandler(options, err) {
  if (options.cleanup) {
    debug('Quitting and Cleaning up');
  }
  if (err) {
    debug(err.stack);
  }
  if (options.exit) {
    debug('Exit');
    process.exit();
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup: true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));

// Setup polling way
var bot = new TelegramBot(BOT_TOKEN, {
  polling: true
});

// Matches /start
bot.onText(/\/start/, function(msg) {
  startHandler.handle(bot, msg);
});

// Matches /e [whatever]
bot.onText(/\/e (.+)/, function(msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});

// Matches /dimanaludik
bot.onText(/\/dimanaludik/, function(msg) {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, 'Masih di jalan gw');
});

//Match /tone [whatever]
bot.onText(/\/tone (.+)/, function(msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  var respToURI = encodeURIComponent(match[1]);
  request('https://watson-api-explorer.mybluemix.net/tone-analyzer-beta/api/v3/tone?version=2016-02-11&text='+respToURI, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var hehe = JSON.parse(body);
    var anger = hehe.document_tone.tone_categories[0].tones[0].score;
    var disgust = hehe.document_tone.tone_categories[0].tones[1].score;
    var fear = hehe.document_tone.tone_categories[0].tones[2].score;
    var joy = hehe.document_tone.tone_categories[0].tones[3].score;
    var sadness = hehe.document_tone.tone_categories[0].tones[4].score;
    bot.sendMessage(fromId, 'Anger : '+ anger + '\n' +'Disgust: ' + disgust + '\n'+'Fear: ' + fear + '\n'+'Joy: ' + joy + '\n' + 'Sadness: ' + sadness);
  }
})
});