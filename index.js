#!/usr/bin/node

const Logger = require('./lib/Logger')

const Server = require('./lib/Server')
const Sass = require('./lib/Sass')
const ClientJS = require('./lib/ClientJS')
const WSFE = require('./lib/WSFE')

const routes = require('./config/routes')

function main() {
	// ENV and defaults
	var port = parseInt(process.env.PORT || '8080')

	// Logger
	var logger = new Logger()
	
	// Boot Message
	logger.raw('WSFE Example Tom Cully')
	logger.raw('v1.0.0')
	logger.raw('')
	logger.raw('Logging Level %s', Logger.logLevelToString(logger.logLevel))

	if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length == 0) {
		logger.error('Env SESSION_SECRET must be defined')
		process.exit(1)
	}

	// Dependencies
	var sass = new Sass({ logger: logger, recompile: process.env.ENV == 'dev' })
	var clientJS = new ClientJS({ logger: logger, debug: process.env.ENV == 'dev' })
	var wsfe = new WSFE({ logger: logger, debug: process.env.ENV == 'dev' })

	// Main Server
	var svr = new Server({
		wsfe: wsfe,
		sass: sass,
		clientJS: clientJS,
		logger: logger,
		port: port,
		cdnUrl: process.env.IMAGE_CDN_URL,
		env: process.env.ENV || 'prod',
		stripe_key: process.env.STRIPE_KEY_PUBLIC
	})

	routes.register(svr)

	// Server Start
	svr.start()
}

main()