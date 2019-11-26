const WSFEClient = require('./WSFEClient')
const ToggleSwitch = require('./ToggleSwitch')

module.exports = () => {
	var ts = new ToggleSwitch()
	
	window.addEventListener('DOMContentLoaded',()=>{
		document.body.appendChild(ts.render())

		var wsfe = new WSFEClient()
		wsfe.connect()
	})
}