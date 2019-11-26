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
		this.state = 'disconnected'

		this.addEvents(['connect','close','error','message','command'])
	}

	connect() {
		console.debug('WSFE: connect')
		this.socket = new WebSocket(this.wsEndpoint, 'wsfev1')
		this.socket.onopen = this._onOpen.bind(this)
		this.socket.onmessage = this._onMessage.bind(this)
		this.socket.onclose = this._onClose.bind(this)
		this.socket.onerror = this._onError.bind(this)
	}

	close() {
		console.debug('WSFE: close')
		this.socket.close()
		this.trigger('close')
	}

	send(cmd, params) {
		this.socket.send(JSON.stringify({c:cmd, p:params}))
	}

	_onOpen() {
		console.debug('WSFE: onOpen')
		this.state = 'handshake'
		this.send('id', { id: this.id } )
	}

	_onMessage(message) {
		console.debug('WSFE: onMessage', message.data)
		this.trigger('message',message.data)
		var pkt
		try {
			pkt = JSON.parse(message.data)
		} catch (e) {
			console.error('WSFE: onMessage: JSON Parse Failed',e)
			return
		}
		if(!pkt.c) return console.error('WSFE: onMessage: No Command')
		this._process(pkt.c, pkt.p)
	}

	_process(cmd, params) {
		console.debug('WSFE: _process', cmd, params)
		switch(cmd) {
		case 'idack':
			console.debug('WSFE: _process: IDACK', params.id)
			this.state = 'connected'
			break
		default: 
			this.trigger('command', cmd, params)
		}
	}

	_onClose() {
		console.debug('WSFE: onClose')
		this.state = 'disconnected'
		this.trigger('close')
	}

	_onError() {
		console.error('WSFE: onError')
		this.trigger('error')
	}

}

module.exports = WSFEClient