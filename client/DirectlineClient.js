const fetch = require('node-fetch')
const WebSocket = require('ws')
const InMemory = require('./repositories/InMemory')

const {
  BOT_DIRECTLINE_SECRET: SECRET,
  INSTAPLY_MESSAGE_POST_ENDPOINT: POST_ENDPOINT,
  INSTAPLY_MESSAGE_POST_TOKEN: TOKEN
} = process.env

const directLineBase = 'https://directline.botframework.com'
const repository = new InMemory()
const conversationMapping = new InMemory() // {conversationId => threadId}

function postToApi (customerThreadId, text) {
  return fetch(POST_ENDPOINT, {
    method: 'post',
    headers: {
      token: TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customerThreadId,
      text
    })
  })
}

function startConversation (threadId) {
  return fetch(directLineBase + `/v3/directline/conversations`, {
    method: 'post',
    headers: {
      authorization: `bearer ${SECRET}`
    }
  })
    .then(res => res.json())
    .then(data => {
      // console.log('get start conversation from directline client', data)
      return repository.set(threadId, {
        conversationId: data.conversationId,
        muteBot: false,
        isConnected: false
      }).then(() => {
        return {url: data.streamUrl, convoId: data.conversationId, threadId}
      })
    }).then(({url, convoId, threadId}) => {
      return conversationMapping.set(convoId, threadId)
        .then(() => {
          return {url, threadId}
        })
    })
    .then(startConnection)
}

function startConnection ({url, threadId}) {
  const ws = new WebSocket(url)
  // console.log('started Conection')
  const resultPromise = new Promise((resolve) => {
    ws.on('open', () => {
      // console.log('WS CONNECTED')
      repository.updateProperty(threadId, 'isConnected', true)
      resolve()
    })
  })
  ws.on('message', (messageStr) => {
    // console.log('got message from websocket', messageStr)
    const message = messageStr !== '' ? JSON.parse(messageStr) : {}
    if (message.activities) {
      // update conversation watermark
      repository.updateProperty(threadId, 'watermark', message.watermark)
      const activity = message.activities[0]
      if (activity.from.name) {
        conversationMapping.get(activity.conversation.id)
          .then((threadId) => {
            // console.log('POST API: ThreadId = ', threadId, 'convoId: ', activity.conversation.id)
            const msg = activity.text
            postToApi(threadId, msg)
          })
      }
    }
  })
  ws.on('disconnect', () => {
    // console.log('WS DISCONNECT')
  })

  return resultPromise
}

function isConnectionOpen (threadId) {
  var connection = repository.get(threadId)
  return connection.then((convoObject) => {
    return convoObject.isConnected
  })
}

function reconnectWebSocket (threadId) {
  return repository.get(threadId)
    .then(convoObject => {
      const endpoint = directLineBase + `/v3/directline/conversations/${convoObject.conversationId}?watermark=${convoObject.watermark}`
      return fetch(endpoint, {
        method: 'post',
        headers: {
          authorization: `bearer ${SECRET}`
        }
      })
    })
    .then(res => res.json())
    .then(result => {
      return {url: result.url, threadId}
    })
    .then(startConnection)
}

function sendMessageToBotConnector (threadId, message) {
  return repository.get(threadId)
    .then((convoObject) => {
      return convoObject.conversationId
    }).then((convoId) => {
      const endpoint = directLineBase + `/v3/directline/conversations/${convoId}/activities`
      // console.log('send message to bot connector endpoint', endpoint)
      return fetch(endpoint, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${SECRET}`
        },
        body: JSON.stringify({
          type: 'message',
          from: {
            id: threadId
          },
          text: message
        })
      })
    })
}

const client = (req, response) => {
  const initialBody = req.body
  const threadId = initialBody.customerThreadId
  const msg = initialBody.messageBody
  const fromCustomer = initialBody.fromCustomer

  var conversationIdRequest = repository.get(threadId)

  console.log('threadId from webhook:', threadId)
  console.log('payload msg:', msg)

  if (!fromCustomer) return
  if (conversationIdRequest.muteBot === true) { return }

  // TODO close ws connection

  repository.exists(threadId)
    .then((convoExists) => {
      if (convoExists) {
        return isConnectionOpen(threadId)
          .then((isConnected) => {
            // console.log('isConnected', isConnected)
            if (!isConnected) {
              return reconnectWebSocket(threadId)
            }
          })
      }
      return startConversation(threadId)
    }).then(() => {
      // console.log('beforeSendingMessage')
      return sendMessageToBotConnector(threadId, msg)
    }).catch((err) => {
      // console.log(err.message)
    })
}

module.exports = client
