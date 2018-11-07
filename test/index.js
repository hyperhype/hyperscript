require('@babel/register')

const {
	JSDOM
} = require('jsdom')
const VDOM = new JSDOM()
global.window = VDOM.window
global.document = VDOM.window.document

const {
	test
} = require('ava')
const observable = require('observable')
const spy = require('ispy')
const simu = require('simulate')

const f = require('../').default

test('simple', (t) => {
	t.is(f('h1').outerHTML, '<h1></h1>')
	t.is(f('h1', 'hello world').outerHTML, '<h1>hello world</h1>')
})

test('nested', (t) => {
	t.is(f('div',
		f('h1', 'Title'),
		f('p', 'Paragraph')
	).outerHTML, '<div><h1>Title</h1><p>Paragraph</p></div>')
})

test('arrays for nesting is ok', (t) => {
	t.is(f('div',
		[
			f('h1', 'Title'),
			f('p', 'Paragraph')
		]
	).outerHTML, '<div><h1>Title</h1><p>Paragraph</p></div>')
})

test('can use namespace in name', (t) => {
	t.is(f('myns:mytag').outerHTML, '<myns:mytag></myns:mytag>')
})

test('can use id selector', (t) => {
	t.is(f('div#frame').outerHTML, '<div id="frame"></div>')
})

test('can use class selector', (t) => {
	t.is(f('div.panel').outerHTML, '<div class="panel"></div>')
})

test('can default element types', (t) => {
	t.is(f('.panel').outerHTML, '<div class="panel"></div>')
	t.is(f('#frame').outerHTML, '<div id="frame"></div>')
})

test('can set properties', (t) => {
	const anchor = f('a', {
		href: 'http://google.com'
	})
	t.is(anchor.href, 'http://google.com/')

	const checkbox = f('input', {
		name: 'yes',
		type: 'checkbox'
	})

	t.is(checkbox.outerHTML, '<input name="yes" type="checkbox">')
})

test('registers event handlers', (t) => {
	const onClick = spy()
	const para = f('p', {
		onclick: onClick
	}, 'something')
	simu.click(para)
	t.true(onClick.called)
})

test('sets styles', (t) => {
	const div = f('div', {
		style: {
			color: 'red'
		}
	})
	t.is(div.style.color, 'red')
})

test('sets data attributes', (t) => {
	const div = f('div', {
		'data-value': 5
	})
	t.is(div.getAttribute('data-value'), '5')
})

test('boolean, number, date, regex get to-string\'ed', (t) => {
	const element = f('p', true, false, 4, new Date('Mon Jan 15 2001'), /hello/)
	t.truthy(element.outerHTML.match(/<p>truefalse4Mon Jan 15.+2001.*\/hello\/<\/p>/))
})

test('observable content', (t) => {
	const title = observable()
	title('Welcome to HyperScript!')
	const h1 = f('h1', title)
	t.is(h1.outerHTML, '<h1>Welcome to HyperScript!</h1>')
	title('Leave, creep!')
	t.is(h1.outerHTML, '<h1>Leave, creep!</h1>')
})

test('observable property', (t) => {
	const checked = observable()
	checked(true)
	const checkbox = f('input', {
		type: 'checkbox',
		checked
	})
	t.is(checkbox.checked, true)
	checked(false)
	t.is(checkbox.checked, false)
})

test('observable style', (t) => {
	const color = observable()
	color('red')
	const div = f('div', {
		style: {
			color
		}
	})
	t.is(div.style.color, 'red')
	color('blue')
	t.is(div.style.color, 'blue')
})

test('context basic', (t) => {
	const context = f.context()
	const element = context('p', 'hello')
	t.is(element.outerHTML, '<p>hello</p>')
	context.cleanup()
})

test('context cleanup removes observable listeners', (t) => {
	const context = f.context()
	const text = observable()
	text('hello')
	const color = observable()
	color('red')
	const className = observable()
	className('para')

	const element = context('p', {
		style: {
			color
		},
		className
	}, text)

	t.is(element.outerHTML, '<p style="color: red; " class="para">hello</p>')

	context.cleanup()
	color('blue')
	text('world')
	className('section')

	t.is(element.outerHTML, '<p style="color: red; " class="para">hello</p>')
})

test('context cleanup removes event handlers', (t) => {
	const context = h.context()
	const onClick = spy()
	const button = context('button', 'Click me!', {
		onclick
	})
	context.cleanup()
	simu.click(button)
	t.false(onClick.called, 'click listener was not triggered')
})

test('unicode selectors', function (t) {
  t.is(f('.⛄').outerHTML, '<div class="⛄"></div>')
  t.is(f('span#⛄').outerHTML, '<span id="⛄"></span>')
})
