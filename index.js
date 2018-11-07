const document = window.document

const addClass = (element, name) => {
	const classes = element.className.length ? element.className.split(/\s+/) : []
	classes.push(name)
	element.className = classes.join(' ')
}

const isNode = (el) => {
	return el && el.nodeName && el.nodeType
}

const has = (object, key) => {
	return object.hasOwnProperty(key)
}

const mapObject = (object, fn) => {
	for (const key in object) {
		if (has(object, key)) {
			fn(object[key], key)
		}
	}
}

const parseClass = (string, source) => {
	let element = source

	// Our minimal parser doesn’t understand escaping CSS special
	// characters like `#`. Don’t use them. More reading:
	// https://mathiasbynens.be/notes/css-escapes .
	const parts = string.split(/([.#]?[^\s#.]+)/)
	if (/^\.|#/.test(parts[1])) {
		element = document.createElement('div')
	}

	parts.forEach((name) => {
		if (!name) {
			return
		}
		if (!element) {
			element = document.createElement(name)

			return
		}

		if (name[0] === '.') {
			addClass(element, name.substring(1))
		}

		if (name[0] === '#') {
			element.setAttribute('id', name.substring(1))
		}
	})

	return element
}

const context = () => {
	const cleanupFuncs = []

	const f = (...args) => {
		let element = null

		const parseArg = (arg) => {
			let childNode = null

			if (arg === null || typeof arg === 'undefined') {
				return childNode
			} else if (typeof arg === 'string') {
				if (element) {
					element.appendChild(childNode = document.createTextNode(arg))
				} else {
					element = parseClass(arg, element)
				}
			} else if (
				typeof arg === 'number' ||
				typeof arg === 'boolean' ||
				arg instanceof Date ||
				arg instanceof RegExp
			) {
				element.appendChild(childNode = document.createTextNode(arg.toString()))
			} else if (Array.isArray(arg)) {
				// There might be a better way to handle this...
				arg.forEach(parseArg)
			} else if (isNode(arg)) {
				if (element) {
					element.appendChild(childNode = arg)
				} else {
					element = arg
				}
			} else if (typeof arg === 'object') {
				mapObject(arg, (keyValue, key) => {
					if (typeof keyValue === 'function') {
						if (/^on\w+/.test(key)) {
							element.addEventListener(key.substring(2), keyValue, false)
							cleanupFuncs.push(() => {
								element.removeEventListener(key.substring(2), keyValue, false)
							})
						} else {
							// Observable
							element[key] = keyValue()
							cleanupFuncs.push(keyValue((value) => {
								element[key] = value
							}))
						}
					} else if (key === 'style') {
						if (typeof keyValue === 'string') {
							element.style.cssText = keyValue
						} else {
							mapObject(keyValue, (value, name) => {
								if (typeof value === 'function') {
									// Observable
									element.style.setProperty(name, value())
									return cleanupFuncs.push(value((val) => {
										element.style.setProperty(name, val)
									}))
								}

								const match = value.match(/(.*)\W+!important\W*$/)

								if (match) {
									return element.style.setProperty(name, match[1], 'important')
								}

								return element.style.setProperty(name, value)
							})
						}
					} else if (key === 'attrs') {
						mapObject(keyValue, (value, name) => {
							element.setAttribute(name, value)
						})
					} else if (key.substr(0, 5) === 'data-') {
						element.setAttribute(key, keyValue)
					} else {
						element[key] = arg[key]
					}
				})
			} else if (typeof arg === 'function') {
				// Assume it's an observable!
				const observable = arg()
				element.appendChild(childNode = isNode(observable) ? observable : document.createTextNode(observable))

				cleanupFuncs.push(arg((value) => {
					if (isNode(value) && childNode.parentElement) {
						childNode.parentElement.replaceChild(value, childNode)
						childNode = value
					} else {
						childNode.textContent = value
					}
				}))
			}

			return childNode
		}

		while (args.length) {
			parseArg(args.shift())
		}

		return element
	}

	f.cleanup = function () {
		cleanupFuncs.forEach((func) => {
			func()
		})

		cleanupFuncs.length = 0
	}

	return f
}

const f = context()
f.context = context

export default f
