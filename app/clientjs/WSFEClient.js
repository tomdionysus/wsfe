const Evented = require('./Evented')
const uuidV4 = require('uuid/v4')

class WSFEClient extends Evented {
	constructor(options = {}) {
		super(options)

		this.wsHost = options.wsHost || (window.location.protocol=='http:' ? 'ws' : 'wss')+'://'+window.location.hostname+(window.location.port == 80 ? '' : ':'+window.location.port)
		this.wsPath = options.wsPath || '/ws'
		this.wsEndpoint = options.wsEndpoint || this.wsHost + this.wsPath
		this.socket = null
		this.id = options.id || uuidV4()

		this.addEvents(['connect','close','error','message'])
	}

	connect() {
		console.log('WSFE: connect')
		this.socket = new WebSocket(this.wsEndpoint, 'wsfev1')
		this.socket.onopen = this._onOpen.bind(this)
		this.socket.onmessage = this._onMessage.bind(this)
		this.socket.onclose = this._onClose.bind(this)
		this.socket.onerror = this._onError.bind(this)
	}

	close() {
		console.log('WSFE: close')
		this.socket.close()
	}

	send(packet) {
		this.socket.send(JSON.stringify(packet))
	}

	_onOpen() {
		console.log('WSFE: onOpen')
		this.send({
			c:'id',
			p:{ id: this.id },
		})
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