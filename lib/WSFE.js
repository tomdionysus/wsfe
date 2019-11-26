const Logger = require('../lib/Logger')
const ScopedLogger = require('../lib/ScopedLogger')

const WS = require('express-ws')

class WSFE {
	constructor(options = {}) {
		this.logger = new ScopedLogger('WSFE', options.logger || new Logger())
		this.debug = !!options.debug
		this.stateTimeout = 30

		this.clients = {}
	}

	registerApp(app) {
		this.app = app
		WS(this.app)
	}

	register(endpointPath) {
		this.endpointPath = endpointPath

		this.app.ws(endpointPath, (ws, req) => {
			var clientEndpoint = req.connection.remoteAddress+':'+req.connection.remotePort
			ws.on('message', (pkt)=>{ this._onMessage(clientEndpoint, pkt, ws) })
			ws.on('close', (pkt)=>{ this._onClose(clientEndpoint, pkt, ws) })
			this._onConnect(clientEndpoint, req, ws)
		})
	}

	_onConnect(clientEndpoint, req, ws) {
		this.logger.debug('_onConnect',req)
		var client = this._getClient(clientEndpoint) 
		client.ws = ws
	}

	_onMessage(clientEndpoint, pkt) {
		this.logger.debug('_onMessage: [%s] %s', clientEndpoint, pkt)
		var packet
		try {
			packet = JSON.parse(pkt)
			if(!packet.c) return this.logger.error('_onMessage: [%s] No Packet Command', clientEndpoint)
		} catch (e) {
			this.logger.error('_onMessage: [%s] JSON Parse Failed', clientEndpoint)
		}
		var client = this._getClient(clientEndpoint)
		this._process(client, packet.c, packet.p)
	}

	_onClose(clientEndpoint) {
		var id = null
		if(this.clients[clientEndpoint]) {
			id = this.clients[clientEndpoint].id
		}
		this.logger.debug('_onClose: [%s] (%s)', clientEndpoint, id || '<unknown ID>')
		delete this.clients[clientEndpoint]
	}

	_getClient(clientEndpoint) {
		this.clients[clientEndpoint] = this.clients[clientEndpoint] || { endpoint: clientEndpoint, state: 'handshake' }
		return this.clients[clientEndpoint]
	}

	_process(client, cmd, params) {
		switch(cmd) {
		case 'id':
			this.logger.debug('_process: [%s] (%s) ID', client.endpoint, params.id)
			client.id = params.id
			client.state = 'connected'
			this.send(client, 'idack', { id: params.id })
		}
	}

	send(client, cmd, params) {
		var data = JSON.stringify({ c: cmd, params: params })
		this.logger.debug('send: [%s] (%s) %s', client.endpoint, client.id || '<unknown ID>', data)
		client.ws.send(data)
	}
}

module.exports = WSFE