const fetch = require('node-fetch')
const uniqid = require('uniqid')
const {BOT_DIRECTLINE_SECRET: SECRET} = process.env

const middleware = (req, res, next) => {
  // TODO Translate webhook payload to chat
  // https://github.com/Microsoft/BotBuilder/blob/master/Node/core/src/bots/ChatConnector.ts#L134

  // req.headers.authorization = `bearer ${SECRET}`
  req.headers.authorization = 'bearer D0Jnw8uVdb0.dAA.OQBRAEgAWQBJAE4ARABqAGcAMAAyADYAcgBGAGYAawA4AGoASwA2AEQAZAA.itd8a4q00gE.Uj062QgJf3I.hvi-wVlgOwvgC0Q-BUk840CyRc8e7TBmRY1LOKrxRxA'
  console.log('Header ======>', req.headers)
  req.body = {
    type: 'conversationUpdate',
    membersAdded: [ { id: 'default-bot', name: 'Bot' } ],
    id: uniqid(),
    channelId: 'directline',
    timestamp: '2017-04-13T16:54:46.962Z',
    localTimestamp: '2017-04-13T11:54:46-05:00',
    recipient: { id: 'default-bot', name: 'Bot' },
    conversation: { id: 'n5hal4nlll0ij1k3i' },
    from: { id: 'default-user', name: 'User' },
    serviceUrl: 'http://localhost:50012'
  }

  console.log('Body ======>', req.body)

  // fetch()
  return next()
}

module.exports = middleware
