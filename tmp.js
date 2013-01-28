var funx = [
function () {
var h = require('hyperscript')    
h('div#page',
  h('div#header',
    h('h1.classy', 'h', { style: {'background-color': '#11a'} })),
  h('div#menu', { style: {'background-color': '#1a1'} },
    h('ul',
      h('li', 'one'),
      h('li', 'two'),
      h('li', 'three'))),
  h('div#content', {style: {'background-color': '#a11'} },
    h('h2', 'content title'),
    h('p', 
      "so it's just like a templating engine,\n",
      "but easy to use inline with javascript\n"),
    h('p', 
      "the intension is for this to be used to create\n",
      "reusable, interactive html widgets. ")))
},
function () {
var h = require('hyperscript')
h('a', {href: 'https://npm.im/hyperscript'}, 'hyperscript')
},
function () {
var h = require('hyperscript')
h('a', {href: '#', 
  onclick: function (e) {
    alert('you are 1,000,000th visitor!')
    e.preventDefault()
  }
}, 'click here to win a prize')
},
function () {
var h = require('hyperscript')
h('h1.fun', {style: {font: 'Comic Sans MS'}}, 'happy birthday!')
},
function () {
var h = require('hyperscript')
var obj = {
  a: 'Apple',
  b: 'Banana',
  c: 'Cherry',
  d: 'Durian',
  e: 'Elder Berry'
}
h('table',
  h('tr', h('th', 'letter'), h('th', 'fruit')),
  Object.keys(obj).map(function (k) {
    return h('tr',
      h('th', k),
      h('td', obj[k].toString())
    )
  })
)
}
];
