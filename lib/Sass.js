const sass = require('node-sass')
const fs = require('fs')
const _ = require('underscore')

const Logger = require('../lib/Logger')
const ScopedLogger = require('../lib/ScopedLogger')

class Sass {
	constructor(options) {
		options = options || { recompile: false }
		this.options = options
		this.logger = new ScopedLogger('SCSS', options.logger || new Logger())
		this.sassOptions = this.sassOptions || {}
		this.fs = options.fs || fs
		this.sass = options.sass || sass
		this._compiled = null

		this.express = this.express.bind(this)
	}

	register(sourceFile) {
		this.sourceFile = sourceFile
		if (this.options.recompile) this.watch.apply(this)
	}

	express(req, res, next) {
		if (this._compiled) {
			this._doOutput(res)
			return
		}

		this.compile((err) => {
			if(err) { 	
				this.logger.error('Compiler Error: %s', err)
				res.status(500)
				next()
				return
			}
			this._doOutput(res)
		})
	}

	_doOutput(res) {
		res.set('content-type','text/css').status(200).send(this._compiled.css).end()
	}

	watch() {
		this.fs.watch(this.sourceFile, _.debounce(() => {
			this.compile((err) => {
				if(err) { this.logger.error('Compiler Error: %s', err) }
			})
		}),1000)
	}

	compile(callback) {
		this.sass.render({ file: this.sourceFile }, (err, result) => {
			if (err) { callback(err); return }
			this._compiled = result
			this.logger.info('CSS %s Compiled', this.sourceFile) 
			callback(null)
		})
	}
}

module.exports = Sass