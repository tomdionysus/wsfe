module.exports.register = function(svr) {
	// System
	svr.registerSaas('/css/app.css', 'sass/app.scss')
	svr.registerClientJS('/js/app.js', 'clientjs')
	svr.registerWSFE('/ws')

	// Public Assets
	svr.registerStatic('/','')
}
