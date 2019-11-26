const Evented = require('./Evented')

class WSFEClient extends Evented {
	constructor(options = {}) {
		super(options)
		
		this.wsHost = options.wsHost || (window.location.protocol=='http:' ? 'ws' : 'wss')+'://'+window.location.hostname+(window.location.port == 80 ? '' : ':'+window.location.port)
		this.wsPath = options.wsPath || '/ws'
		this.wsEndpoint = options.wsEndpoint || this.wsHost + this.wsPath
		this.socket = null
	}

	connect() {
		console.log('WSFE: connect')
		this.socket = new WebSocket(this.wsEndpoint, 'wsfev1')
		this.onopen = this._onOpen.bind(this)
		this.onmessage = this._onMessage.bind(this)
		this.onclose = this._onClose.bind(this)
		this.onerror = this._onError.bind(this)
	}

	close() {
		console.log('WSFE: close')
		this.socket.close()
	}

	_onOpen() {
		console.log('WSFE: onOpen')
	}

	_onMessage() {
		console.log('WSFE: onMessage')
	}

	_onClose() {
		console.log('WSFE: onClose')
	}

	_onError() {
		console.log('WSFE: onError')
	}

}

module.exports = WSFEClient