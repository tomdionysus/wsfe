const express = require('express')
const path = require('path')
const compression = require('compression')

const Logger = require('../lib/Logger')
const ScopedLogger = require('../lib/ScopedLogger')

class Server {
	constructor(options = {}) {

		this.port = options.port || 8080
		this.env = options.env || 'prod'
		this.stripe_key = options.stripe_key || ''

		this.cdnUrl = options.cdnUrl || ''

		// IoC depedencies
		this.logger = new ScopedLogger('HTTP', options.logger || new Logger())
		this.sass = options.sass || null
		this.clientJS = options.clientJS || null
		this.wsfe = options.wsfe || null

		// The main HTTP server
		this.app = express()
		this.app.disable('x-powered-by')

		// Public healthcheck route for Load Balancer
		this.app.get('/healthcheck', (req, res) => { res.status(200).end() })

		// Robots.txt
		this.app.use('/robots.txt', this.robotsTxt.bind(this))

		// In production, redirect HTTP to HTTPS
		if (this.env == 'prod') {
			this.app.use((req, res, next) => { this.httpsRedirect(req, res, next) })
		}

		if(this.wsfe) {
			this.wsfe.registerApp(this.app)
		}

		this.wsfe.on('command', (client, cmd, params) => {
			if(cmd=='toggle-demo-switch') {
				this.wsfe.sendAll(cmd, params, client.endpoint)
			}
		})

		// Logger
		this.app.use(this.httpLogger.bind(this))

		// Compression
		this.app.use(compression())
	}

	registerStatic(route, filepath) {
		this.app.use(route, express.static(path.join(__dirname, '../app/public', filepath)))
	}

	registerSaas(route, filepath) {
		this.sass.register(path.join(__dirname, '../app', filepath))
		this.app.use(route, this.sass.express)
	}

	registerClientJS(route, filepath) {
		this.clientJS.register(path.join(__dirname, '../app', filepath))
		this.app.use(route, this.clientJS.express)
	}

	registerWSFE(wsEndpoint) {
		this.wsfe.register(wsEndpoint)
	}

	start() {
		// Finally, return not found
		this.app.use((req, res) => {
			res.status(404).end()
		})

		// Catch All Error Handler
		this.app.use((err, req, res) => {
			res.status(500).end()
		})

		this.app.listen(this.port, () => {
			this.logger.info('Server listening on port %d', this.port)
		})
	}

	// HTTP logger middleware
	httpLogger(req, res, next) {
		this.logger.info('%s %s',req.method, req.url)
		next()
	}

	robotsTxt(req, res) {
		res
			.set('content-type','text/plain')
			.status(200)
			.send('User-agent: *\nDisallow: /\n')
			.end()
	}
}

module.exports = Server