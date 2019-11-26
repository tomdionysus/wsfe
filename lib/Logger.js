var vsprintf = require('sprintf-js').vsprintf
var _defaultLogger

class Logger {
	constructor(options = {}) {
		this.logLevel = Logger.stringToLogLevel(options.logLevel || process.env.LOG_LEVEL || 'WARN')
		this.logTo = options.logTo || console
	}
	
	debug() {
		if(this.logLevel>0) return
		this.log('DEBUG', Array.from(arguments))
	}

	info() {
		if(this.logLevel>1) return
		this.log('INFO ', Array.from(arguments))
	}

	warn() {
		if(this.logLevel>2) return
		this.log('WARN ', Array.from(arguments))
	}

	error() {
		this.log('ERROR', Array.from(arguments))
	}

	raw() {
		this.log('-----', Array.from(arguments))
	}

	/* eslint-disable no-console */
	log(type, args) {
		var d = new Date().toISOString()
		var fmt = args.shift()
		var s = vsprintf(fmt, args)
		if(type=='ERROR') return console.error(d+' [ERROR] '+s)
		console.log(d+' ['+type+'] '+s)
	}
	/* eslint-enable no-console */

	static getDefaultLogger() {
		if (_defaultLogger) { return _defaultLogger }
		return _defaultLogger = new Logger()
	}

	static stringToLogLevel(str) {
		str = str.toUpperCase().trim()
		switch(str) {
		case 'DEBUG':
			return Logger.Debug
		case 'INFO':
			return Logger.Info
		case 'WARN':
			return Logger.Warn
		case 'ERROR':
			return Logger.Error		
		}
		return Logger.Unknown
	}

	static logLevelToString(level) {
		switch(level) {
		case Logger.Debug:
			return 'DEBUG'
		case Logger.Info:
			return 'INFO'
		case Logger.Warn:
			return 'WARN'
		case Logger.Error:
			return 'ERROR'	
		}
		return '-----'
	}
}

Logger.Unknown = -1
Logger.Debug = 0
Logger.Info = 1
Logger.Warn = 2
Logger.Error = 3
module.exports = Logger