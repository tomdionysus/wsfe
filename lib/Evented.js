class Evented {
	constructor(options = {}) {
		this._events = options.events || {}
	}

	addEvent(event) {
		this._events[event] = []
	}

	removeEvent(event) {
		delete this._events[event]
	}

	addEvents(events) {
		for(var i in events) this.addEvent(events[i])
	}

	removeEvents(events) {
		for(var i in events) this.removeEvent(events[i])
	}

	on(event, fn) {
		if(!this._events[event]) throw 'on: no such event '+event
		if(this._events[event].indexOf(fn)==-1) this._events[event].push(fn)
		return this
	}

	unon(event, fn) {
		if(!this._events[event]) throw 'unon: no such event '+event
		var x = this._events[event]
		var i = x.indexOf(fn)
		if (i > -1) { x.splice(i, 1) }
		this._events[event] = x
		return this
	}

	addEventListener(event, fn) { return this.on(event, fn) }
	removeEventListener(event, fn) { return this.unon(event, fn) }

	trigger(...args) {
		var event = args.shift()
		if(!this._events[event]) throw 'trigger: no such event '+event
		for(var i in this._events[event]) { setImmediate(()=>{this._events[event][i].apply(null,args)}) }
	}

	getEventListeners(event) {
		if(!this._events[event]) throw 'getEventListeners: no such event '+event
		return this._events[event]
	}
}

module.exports = Evented