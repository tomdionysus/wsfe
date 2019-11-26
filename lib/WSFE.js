const Logger = require('../lib/Logger')
const ScopedLogger = require('../lib/ScopedLogger')

const WS = require('express-ws')

class WSFE {
	constructor(options = {}) {
		this.logger = new ScopedLogger('WSFE', options.logger || new Logger())
		this.debug = !!options.debug
	}

	registerApp(app) {
		this.app = app
		WS(this.app)
	}

	register(endpointPath) {
		this.endpointPath = endpointPath

		this.app.ws(endpointPath, (ws, req) => {
			ws.on('message', this._onMessage.bind(this))
			ws.on('close', this._onClose.bind(this))
			this._onConnect(req,ws)
		})
	}

	_onConnect(req, ws) {
		this.logger.debug('_onConnect',req)
	}

	_onMessage(evt) {
		this.logger.debug('_onMessage',evt)
	}

	_onClose(evt) {
		this.logger.debug('_onClose',evt)
	}
}

module.exports = WSFE