class InMemory {
  constructor () {
    this.db = new Map()
  }

  get (key) { // return a Promise
    return new Promise((resolve) => {
      const value = this.db.get(key)
      setTimeout(() => {
        resolve(value)
      }, 0)
    })
  }

  set (key, value) { // returns a Promise
    return new Promise((resolve) => {
      this.db.set(key, value)
      setTimeout(() => {
        resolve()
      }, 0)
    })
  }

  exists (key) { // returns a Promise
    return this.get(key)
        .then(function (value) {
          return (typeof value !== 'undefined')
        })
  }

  updateProperty (key, property, value) { // returns a Promise
    return this.get(key)
      .then((convoObject) => {
        convoObject[property] = value
        return this.set(key, convoObject)
      })
  }
}

module.exports = InMemory

// key: customerThreadID
  // value: { conversationID: xxx,
  //          muteBot:(boolean),
  //          isConnected: (boolean)
  //          watermark: xxx }
