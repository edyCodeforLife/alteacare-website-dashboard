const EventEmitter = {
  events: {},
  emit: function (event, data) {
    if (!this.events[event]) return
    const currentEvents = this.events[event]
    Object.keys(currentEvents).map((key) => currentEvents[key](data))
  },
  subscribe: function (event, callback) {
    if (!this.events[event]) this.events[event] = {}
    this.events[event][callback.name] = callback
  },
  unsubscribe: function (event, callback) {
    if (this.events[event][callback.name]) {
      delete this.events[event][callback.name]
    }
  },
}

module.exports = EventEmitter
