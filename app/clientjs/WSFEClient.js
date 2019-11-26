class WSFEClient {
	constructor(options = {}) {
		this.wsHost = options.wsHost || (window.location.protocol=='http:' ? 'ws' : 'wss')+'://'+window.location.hostname+(window.location.port == 80 ? '' : ':'+window.location.port)
		this.wsPath = options.wsPath || '/ws'
		this.wsEndpoint = options.wsEndpoint || this.wsHost + this.wsPath
		this.socket = null
	}

	connect() {
		console.log('WSFE: connect')
		this.socket = new WebSocket(this.wsEndpoint, 'wsfev1')
		this.onopen = this.onOpen.bind(this)
		this.onmessage = this.onMessage.bind(this)
		this.onclose = this.onClose.bind(this)
		this.onerror = this.onError.bind(this)
	}

	close() {
		console.log('WSFE: close')
		this.socket.close()
	}

	onOpen() {
		console.log('WSFE: onOpen')
	}

	onMessage() {
		console.log('WSFE: onMessage')
	}

	onClose() {
		console.log('WSFE: onClose')
	}

	onError() {
		console.log('WSFE: onError')
	}

}

module.exports = WSFEClient