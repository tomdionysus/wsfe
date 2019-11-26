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
	var logger = new Logger({ logLevel: process.env.LOG_LEVEL || 'DEBUG' })
	
	// Boot Message
	logger.raw('WSFE Example Tom Cully')
	logger.raw('v1.0.0')
	logger.raw('')
	logger.raw('Logging Level %s', Logger.logLevelToString(logger.logLevel))

	// Dependencies
	var sass = new Sass({ logger: logger, recompile: true })
	var clientJS = new ClientJS({ logger: logger, debug: true })
	var wsfe = new WSFE({ logger: logger, debug: true })

	// Main Server
	var svr = new Server({
		wsfe: wsfe,
		sass: sass,
		clientJS: clientJS,
		logger: logger,
		port: port,
		env: process.env.ENV || 'prod',
	})

	routes.register(svr)

	// Server Start
	svr.start()
}

main()