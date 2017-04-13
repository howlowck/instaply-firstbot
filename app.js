require('dotenv').config()
var restify = require('restify')
var builder = require('botbuilder')
var DirectlineClient = require('./client/DirectlineClient')

// =========================================================
// Bot Setup
// =========================================================

// Setup Restify Server
var server = restify.createServer()
server.use(restify.bodyParser())

server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url)
})

// Create chat bot
var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
})
var bot = new builder.UniversalBot(connector)
server.post('/api/messages', connector.listen())
server.post('/bot-receiver', DirectlineClient)

// =========================================================
// Bots Dialogs
// =========================================================

bot.dialog('/', function (session) {
  session.send('Hello World')
})
