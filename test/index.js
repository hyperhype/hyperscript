global.document = require('html-element').document;

var test = require('tape')
var h    = require('../')
var o    = require('observable')
var spy  = require('ispy')
var simu = require('simulate')

test('simple', function (t) {
  t.equal(h('h1').outerHTML, '<h1></h1>')
  t.equal(h('h1', 'hello world').outerHTML, '<h1>hello world</h1>')
  t.end()
})

test('nested', function(t) {
  t.equal(h('div',
    h('h1', 'Title'),
    h('p', 'Paragraph')
  ).outerHTML, '<div><h1>Title</h1><p>Paragraph</p></div>')
  t.end()
})

test('arrays for nesting is ok', function(t){
  t.equal(h('div',
    [h('h1', 'Title'), h('p', 'Paragraph')]
  ).outerHTML, '<div><h1>Title</h1><p>Paragraph</p></div>')
  t.end()
})

test('can use namespace in name', function(t){
  t.equal(h('myns:mytag').outerHTML, '<myns:mytag></myns:mytag>');
  t.end()
})

test('can use id selector', function(t){
  t.equal(h('div#frame').outerHTML, '<div id="frame"></div>')
  t.end()
})

test('can use class selector', function(t){
  t.equal(h('div.panel').outerHTML, '<div class="panel"></div>')
  t.end()
})

test('can default element types', function(t){
  t.equal(h('.panel').outerHTML, '<div class="panel"></div>')
  t.equal(h('#frame').outerHTML, '<div id="frame"></div>')
  t.end()
})

test('can set properties', function(t){
  var a = h('a', {href: 'http://google.com'})
  t.equal(a.href, 'http://google.com/')
  var checkbox = h('input', {name: 'yes', type: 'checkbox'})
  t.equal(checkbox.outerHTML, '<input name="yes" type="checkbox">')
  t.end()
})

test('registers event handlers', function(t){
  var onClick = spy()
  var p = h('p', {onclick: onClick}, 'something')
  simu.click(p)
  t.assert(onClick.called)
  t.end()
})

test('sets styles', function(t){
  var div = h('div', {style: {'color': 'red'}})
  t.equal(div.style.color, 'red')
  t.end()
})

test('sets styles as text', function(t){
  var div = h('div', {style: 'color: red'})
  t.equal(div.style.color, 'red')
  t.end()
})

test('sets data attributes', function(t){
  var div = h('div', {'data-value': 5})
  t.equal(div.getAttribute('data-value'), '5') // failing for IE9
  t.end()
})

test('boolean, number, date, regex get to-string\'ed', function(t){
  var e = h('p', true, false, 4, new Date('Mon Jan 15 2001'), /hello/)
  t.assert(e.outerHTML.match(/<p>truefalse4Mon Jan 15.+2001.*\/hello\/<\/p>/))
  t.end()
})

test('observable content', function(t){
  var title = o()
  title('Welcome to HyperScript!')
  var h1 = h('h1', title)
  t.equal(h1.outerHTML, '<h1>Welcome to HyperScript!</h1>')
  title('Leave, creep!')
  t.equal(h1.outerHTML, '<h1>Leave, creep!</h1>')
  t.end()
})

test('observable property', function(t){
  var checked = o()
  checked(true)
  var checkbox = h('input', {type: 'checkbox', checked: checked})
  t.equal(checkbox.checked, true)
  checked(false)
  t.equal(checkbox.checked, false)
  t.end()
})

test('observable style', function(t){
  var color = o()
  color('red')
  var div = h('div', {style: {'color': color}})
  t.equal(div.style.color, 'red')
  color('blue')
  t.equal(div.style.color, 'blue')
  t.end()
})

test('context basic', function(t){
  var _h = h.context()
  var p = _h('p', 'hello')
  t.equal(p.outerHTML, '<p>hello</p>')
  _h.cleanup()
  t.end()
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
  t.equal(p.outerHTML, '<p style=\"color: red; \" class=\"para\">hello</p>')
  _h.cleanup()
  color('blue')
  text('world')
  className('section')
  t.equal(p.outerHTML, '<p style=\"color: red; \" class=\"para\">hello</p>')
  t.end()
})

test('context cleanup removes event handlers', function(t){
  var _h = h.context()
  var onClick = spy()
  var button = _h('button', 'Click me!', {onclick: onClick})
  _h.cleanup()
  simu.click(button)
  t.assert(!onClick.called, 'click listener was not triggered')
  t.end()
})

test('unicode selectors', function (t) {
  t.equal(h('.⛄').outerHTML, '<div class="⛄"></div>')
  t.equal(h('span#⛄').outerHTML, '<span id="⛄"></span>')
  t.end()
})
