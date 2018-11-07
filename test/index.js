require('@babel/register');

const { JSDOM } = require('jsdom')
const VDOM = new JSDOM()
global.window = VDOM.window
global.document = VDOM.window.document

// var test = require('tape')
var o = require('observable')
var spy = require('ispy')
var simu = require('simulate')

const { test } = require('ava')

var h = require('../').default

test('simple', function (t) {
  t.deepEqual(h('h1').outerHTML, '<h1></h1>')
  t.deepEqual(h('h1', 'hello world').outerHTML, '<h1>hello world</h1>')
})

test('nested', function(t) {
  t.deepEqual(h('div',
    h('h1', 'Title'),
    h('p', 'Paragraph')
  ).outerHTML, '<div><h1>Title</h1><p>Paragraph</p></div>')
})

test('arrays for nesting is ok', function(t){
  t.deepEqual(h('div',
    [h('h1', 'Title'), h('p', 'Paragraph')]
  ).outerHTML, '<div><h1>Title</h1><p>Paragraph</p></div>')
})

test('can use namespace in name', function(t){
  t.deepEqual(h('myns:mytag').outerHTML, '<myns:mytag></myns:mytag>');
})

test('can use id selector', function(t){
  t.deepEqual(h('div#frame').outerHTML, '<div id="frame"></div>')
})

test('can use class selector', function(t){
  t.deepEqual(h('div.panel').outerHTML, '<div class="panel"></div>')
})

test('can default element types', function(t){
  t.deepEqual(h('.panel').outerHTML, '<div class="panel"></div>')
  t.deepEqual(h('#frame').outerHTML, '<div id="frame"></div>')
})

test('can set properties', function(t){
  var a = h('a', {href: 'http://google.com'})
  t.deepEqual(a.href, 'http://google.com/')
  var checkbox = h('input', {name: 'yes', type: 'checkbox'})
  t.deepEqual(checkbox.outerHTML, '<input name="yes" type="checkbox">')
})

test('registers event handlers', function(t){
  var onClick = spy()
  var p = h('p', {onclick: onClick}, 'something')
  simu.click(p)
  t.assert(onClick.called)
})

test('sets styles', function(t){
  var div = h('div', {style: {'color': 'red'}})
  t.deepEqual(div.style.color, 'red')
})

test('sets styles as text', function(t){
  var div = h('div', {style: 'color: red'})
  t.deepEqual(div.style.color, 'red')
})

test('sets data attributes', function(t){
  var div = h('div', {'data-value': 5})
  t.deepEqual(div.getAttribute('data-value'), '5') // failing for IE9
})

test('boolean, number, date, regex get to-string\'ed', function(t){
  var e = h('p', true, false, 4, new Date('Mon Jan 15 2001'), /hello/)
  t.assert(e.outerHTML.match(/<p>truefalse4Mon Jan 15.+2001.*\/hello\/<\/p>/))
})

test('observable content', function(t){
  var title = o()
  title('Welcome to HyperScript!')
  var h1 = h('h1', title)
  t.deepEqual(h1.outerHTML, '<h1>Welcome to HyperScript!</h1>')
  title('Leave, creep!')
  t.deepEqual(h1.outerHTML, '<h1>Leave, creep!</h1>')
})

test('observable property', function(t){
  var checked = o()
  checked(true)
  var checkbox = h('input', {type: 'checkbox', checked: checked})
  t.deepEqual(checkbox.checked, true)
  checked(false)
  t.deepEqual(checkbox.checked, false)
})

test('observable style', function(t){
  var color = o()
  color('red')
  var div = h('div', {style: {'color': color}})
  t.deepEqual(div.style.color, 'red')
  color('blue')
  t.deepEqual(div.style.color, 'blue')
})

test('context basic', function(t){
  var _h = h.context()
  var p = _h('p', 'hello')
  t.deepEqual(p.outerHTML, '<p>hello</p>')
  _h.cleanup()
})

test('context cleanup removes observable listeners', function(t){
  var _h = h.context()
  var text = o()
  text('hello')
  var color = o()
  color('red')
  var className = o()
  className('para')
  var p = _h('p', {style: {color: color}, className: className}, text)
  t.deepEqual(p.outerHTML, '<p style=\"color: red; \" class=\"para\">hello</p>')
  _h.cleanup()
  color('blue')
  text('world')
  className('section')
  t.deepEqual(p.outerHTML, '<p style=\"color: red; \" class=\"para\">hello</p>')
})

test('context cleanup removes event handlers', function(t){
  var _h = h.context()
  var onClick = spy()
  var button = _h('button', 'Click me!', {onclick: onClick})
  _h.cleanup()
  simu.click(button)
  t.assert(!onClick.called, 'click listener was not triggered')
})

test('unicode selectors', function (t) {
  t.deepEqual(h('.⛄').outerHTML, '<div class="⛄"></div>')
  t.deepEqual(h('span#⛄').outerHTML, '<span id="⛄"></span>')
})
