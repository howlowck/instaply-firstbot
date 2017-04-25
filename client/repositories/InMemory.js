class InMemory {
  constructor () {
    this.db = new Map()
  }

  get (key) { // return a Promise
    const value = this.db.get(key)
    return new Promise(function (resolve) {
      resolve(value)
    })
  }

  set (key, value) { // returns a Promise
    this.db.set(key, value)
  }

  exists (key) { // returns a Promise
    return this.get(key)
        .then(function (value) {
          return (typeof value !== 'undefined')
        })
  }
}

module.exports = InMemory

// key: customerThreadID
  // value: { conversationID: xxx,
  //          muteBot:(boolean),
  //          isConnected: (boolean) }
