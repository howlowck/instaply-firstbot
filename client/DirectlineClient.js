const fetch = require('node-fetch')
const WebSocket = require('ws')

const {
  BOT_DIRECTLINE_SECRET: SECRET,
  INSTAPLY_MESSAGE_POST_ENDPOINT: POST_ENDPOINT,
  INSTAPLY_MESSAGE_POST_TOKEN: TOKEN
} = process.env

const directLineBase = 'https://directline.botframework.com'
const conversations = new Map()

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

function isConversationOpen (threadId) {
  return !!conversations.get(threadId)
}

function getThreadIdFromConversationId (convoId) {
  let result = null
  conversations.forEach((convo, thread) => {
    if (convo === convoId) {
      result = thread
    }
  })
  return result
}

function sendMessage (threadId, message) {
  const convoId = conversations.get(threadId)
  return fetch(directLineBase + `/v3/directline/conversations/${convoId}/activities`, {
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
}

const client = (req, response) => {
  const initialBody = req.body
  const threadId = initialBody.customerThreadId
  const msg = initialBody.messageBody
  const fromCustomer = initialBody.fromCustomer
  const muteBot = initialBody.muteBot

  if (!fromCustomer) return
  if (muteBot) return
  //TODO add logic to end conversation (on muteBot)
  //TODO close ws connection

  if (isConversationOpen(threadId)) {
    sendMessage(threadId, msg)
      .then(() => {
        response.json({'message': 'message successfully sent'})
      })
    return
  }

  fetch(directLineBase + `/v3/directline/conversations`, {
    method: 'post',
    headers: {
      authorization: `bearer ${SECRET}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      conversations.set(threadId, data.conversationId)
      const ws = new WebSocket(data.streamUrl)
      ws.on('message', (messageStr) => {
        const message = messageStr !== '' ? JSON.parse(messageStr) : {}
        if (message.activities) {
          const activity = message.activities[0]
          if (activity.from.name) {
            const threadId = getThreadIdFromConversationId(activity.conversation.id)
            const msg = activity.text
            postToApi(threadId, msg)
          }
        }
      })
      // TODO add logic to determine if a connection needs to be reestablished
      // TODO add ws object to the conversations Map
      // TODO check ws object has a isOpen

      ws.on('disconnect', ())
    })
    .then(() => {
      return sendMessage(threadId, msg)
    })
    .catch((err) => {
      console.log(err.message)
    })


}

module.exports = client
