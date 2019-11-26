const stream = require('stream')
const path = require('path')
const fs = require('fs')
const browserify = require('browserify')
const Logger = require('../lib/Logger')
const ScopedLogger = require('../lib/ScopedLogger')

class ClientJS {
	constructor(options = {}) {
		this.logger = new ScopedLogger('ClientJS', options.logger || new Logger())
		this.fs = options.fs || fs
		this.path = options.path || path
		this.beautify = true
		this.express = this.express.bind(this)
		this.debug = !!options.debug

		this.reloadCompile = this.reloadCompile.bind(this)
	}

	register(sourceDir) {
		this.sourceDir = sourceDir

		this.reloadCompile()

		this.fs.watch(this.sourceDir, { recursive: true }, this.reloadCompile)
	}

	reloadCompile() {
		this.load()
		this.compile()
	}

	_doOutput(res) {
		res.set('content-type','application/javascript').status(200).send(this._compiled)
	}

	express(req, res, next) {
		if (this._compiled) {
			this._doOutput(res)
			return
		}

		this.compile((err) => {
			if(err) {
				this.logger.error('Compiler Error - %s', err)
				res.status(500)
				next()
				return
			}
			this._doOutput(res)
		})
	}

	compile(cb) {
		this._compiled = ''

		var i, file

		try {
			var result = browserify({ debug: this.debug, basedir: this.sourceDir })

			// Load Controllers
			for(i in this.sources) {
				file = this.sources[i]
				var name = file.substr(0, file.length-3) 
				result.require(path.join(this.sourceDir, file), { expose: name })
			}

			if(!this.debug) {
				this.logger.error('Uglifying Output')
				result.transform('uglifyify', { global: true })
			}

			result
				.bundle()
				.on('error', (err) => {
					this.logger.error('Compiler Error %s', err.toString())
					if(cb) cb(err)
					return 
				}).on('data', (d) => {
					this._compiled += d.toString()
				}).on('end', () => {
					this.logger.debug('Recompiled ClientJS')
				
					if(cb) cb()
				})
		
		} catch(err) {
			this.logger.error('Compiler Error - %s', err)
			if(cb) cb(err)
			return 
		}
	}

	static asStream(text) {
		var s = new stream.Readable()
		s._read = () => {}
		s.push(text)
		s.push(null)
		return s
	}

	load() {
		this.sources = []
		this.templates = []
		this._load('', this.sourceDir)
	}

	_load(filePath, base) {
		var files = fs.readdirSync(path.join(base, filePath))
		for(var i in files) {
			var file = files[i]
			var relpath = path.join(filePath, file)
			var fullPath = path.join(base, relpath)
			var stats = fs.statSync(fullPath)
			if (stats.isDirectory()) { 
				this._load(relpath, base)
				continue 
			}
			switch(path.extname(file)) {
			case '.js':
				this.sources.push(relpath)
				break
			}
		}
	}
}

module.exports = ClientJS