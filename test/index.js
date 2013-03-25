
//adds globals...
require('html-element')

var tape = require('tape')
var h    = require('../')

tape('simple', function (t) {
  t.equal(h('h1').outerHTML, '<h1>\n\n</h1>')
  t.end()
})
