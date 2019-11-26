const Logger = require('../lib/Logger')
const ScopedLogger = require('../lib/ScopedLogger')

class WSFE {
	constructor(options = {}) {
		this.logger = new ScopedLogger('WSFE', options.logger || new Logger())
		this.debug = !!options.debug
		this.express = this.express.bind(this)
	}

	register(endpointPath) {
		this.endpointPath = endpointPath
	}

	express(req, res, next) {
		next()
	}
}

module.exports = WSFE