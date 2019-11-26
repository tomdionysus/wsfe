const Evented = require('./Evented')

class ToggleSwitch extends Evented {
	constructor(options = {}) {
		super(options)

		this.cssClass = options.cssClass || 'toggle-switch'
		this.cssClassActive = options.cssClassActive || 'active'
		this.cssClassInactive = options.cssClassInactive || 'inactive'
		this.state = typeof(options.state) !== 'undefined' ? false : !!options.state || false
		this.lastState = this.state

		this.addEvent('change')
	}

	render() {
		if(this.element) return this.element

		this.element = document.createElement('div')
		this.element.classList.add(this.cssClass)

		this.elementOn = document.createElement('div')
		this.elementOn.textContent = 'ON'
		this.elementOff = document.createElement('div')
		this.elementOff.textContent = 'OFF'

		this.element.appendChild(this.elementOff)
		this.element.appendChild(this.elementOn)

		this.elementOn.addEventListener('click',()=>{ this.setState(true) })
		this.elementOff.addEventListener('click',()=>{ this.setState(false) })

		this.setState(this.state)

		return this.element
	}

	setState(onOff) {
		this.elementOn.classList.toggle(this.cssClassActive, onOff)
		this.elementOn.classList.toggle(this.cssClassInactive, !onOff)
		this.elementOff.classList.toggle(this.cssClassActive, !onOff)
		this.elementOff.classList.toggle(this.cssClassInactive, onOff)
		this.state = onOff

		if(this.state!==this.lastState) {
			this.trigger('change')
			this.lastState = this.state
		}
	}
}

module.exports = ToggleSwitch

