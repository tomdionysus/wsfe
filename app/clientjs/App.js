const WSFEClient = require('./WSFEClient')
const ToggleSwitch = require('./ToggleSwitch')

module.exports = () => {
	var ts = new ToggleSwitch()
	
	window.addEventListener('DOMContentLoaded',()=>{
		document.body.appendChild(ts.render())

		var wsfe = new WSFEClient()
		wsfe.connect()

		ts.addEventListener('change', () => {
			wsfe.send('toggle-demo-switch',{ state: ts.state })
		})

		wsfe.addEventListener('command',(cmd, params) => {
			if(cmd=='toggle-demo-switch') {
				ts.setState(params.state)
			}
		})
	})
}