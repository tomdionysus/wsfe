const WSFEClient = require('./WSFEClient')

module.exports = () => {
	var wsfe = new WSFEClient()
	wsfe.connect()
}