# HyperScript

Create HyperText with JavaScript, on client or server.

[![testling badge](https://ci.testling.com/dominictarr/hyperscript.png)]
  (https://ci.testling.com/dominictarr/hyperscript)

[Interactive Demo](http://dominictarr.github.com/hyperscript)

See also [mercury](https://github.com/Raynos/mercury) is a modular ui
framework influenced by hyperscript but much more heavily optimized.

## Example

``` js
var h = require('hyperscript')
h('div#page',
  h('div#header',
    h('h1.classy', 'h', { style: {'background-color': '#22f'} })),
  h('div#menu', { style: {'background-color': '#2f2'} },
    h('ul',
      h('li', 'one'),
      h('li', 'two'),
      h('li', 'three'))),
    h('h2', 'content title',  { style: {'background-color': '#f22'} }),
    h('p',
      "so it's just like a templating engine,\n",
      "but easy to use inline with javascript\n"),
    h('p',
      "the intension is for this to be used to create\n",
      "reusable, interactive html widgets. "))
```

## on the server

you can still use hyperscript on the server,
the limitation is that events don't make sense any more,
but you can use it to generate html:

``` js
console.log(h('h1', 'hello!').outerHTML)
=> '<h1>hello!</h1>'
```

## h (tag, attrs, [text?, Elements?,...])

Create an `HTMLElement`. The first argument must be the tag name, you may use a
fully qualified tagname for building e.g. XML documents: `h('ns:tag').

### classes & id

If the tag name is of form `name.class1.class2#id` that is a short cut
for setting the class and id.

### default tag name

If the tag name begins with a class or id, it defaults to a `<div>`.

### Attributes

If an `{}` object is passed in it will be used to set attributes.

``` js
var h = require('hyperscript')
h('a', {href: 'https://npm.im/hyperscript'}, 'hyperscript')
```

Note that hyperscript sets properties on the DOM element object, not
attributes on the HTML element. This makes for better consistency across
browsers and a nicer API for booleans. There are some gotchas, however.
Attributes such as `colspan` are camel cased to `colSpan`, and `for` on the
label element is `htmlFor` to avoid collision with the language keyword. See the
[DOM HTML specification](http://www.w3.org/TR/DOM-Level-2-HTML/html.html)
for details.

### events

If an attribute is a function, then it will be registered as an event listener.

``` js
var h = require('hyperscript')
h('a', {href: '#',
  onclick: function (e) {
    alert('you are 1,000,000th visitor!')
    e.preventDefault()
  }
}, 'click here to win a prize')
```

### styles

If an attribute has a style property, then that will be handled specially.

``` js
var h = require('hyperscript')
h('h1.fun', {style: {'font-family': 'Comic Sans MS'}}, 'Happy Birthday!')
```

or as a string

``` js
var h = require('hyperscript')
h('h1.fun', {style: 'font-family: Comic Sans MS'}, 'Happy Birthday!')
```

You may pass in attributes in multiple positions, it's no problem!

### children - string

If an argument is a string, a TextNode is created in that position.

### children - HTMLElement

If a argument is a `Node` (or `HTMLElement`), for example, the return value of a call to `h`
thats cool too.

### children - null.

This is just ignored.

### children - Array

Each item in the array is treated like a ordinary child. (string or HTMLElement)
this is useful when you want to iterate over an object:

``` js
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
      h('td', obj[k])
    )
  })
)
```

### Cleaning Up

If you need to clean up a widget created using hyperscript - deregistering all its event handlers and observable listeners, you can use `context()`.

``` js
var h = require('hyperscript').context()
var o = require('observable')
var text = o()
text('click here to win a prize')
h('a', {href: '#',
  onclick: function (e) {
    text('you are 1,000,000th visitor!')
    e.preventDefault()
  }
}, text)

// then if you want to remove this widget from the page
// to cleanup
h.cleanup()

```
## Ecosystem

* [html2hscript](https://github.com/twilson63/html2hscript) - Parse HTML into hyperscript
* [dom2hscript](https://github.com/AkeemMcLennon/dom2hscript) - Frontend library for parsing HTML into hyperscript using the browser's built in parser.
* [html2hscript.herokuapp.com](http://html2hscript.herokuapp.com/) - Online Tool that converts html snippets to hyperscript
* [html2hyperscript](https://github.com/unframework/html2hyperscript) - Original commandline utility to convert legacy HTML markup into hyperscript
* [hyperscript-helpers](https://github.com/ohanhi/hyperscript-helpers) - write `div(h1('hello')` instead of `h('div', h('h1', 'hello'))`
* [react-hyperscript](https://github.com/mlmorg/react-hyperscript)  - use hyperscript with React.

## License

MIT



