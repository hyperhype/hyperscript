# FenzyScript

Create HyperText with JavaScript, on client or server.

This is a fork of [hyperscript](https://github.com/hyperhype/hyperscript).

[![npm version](https://badge.fury.io/js/frenzyscript.svg)](http://badge.fury.io/js/frenzyscript)
[![Build Status](https://travis-ci.org/LucianBuzzo/frenzyscript.svg?branch=master)](https://travis-ci.org/LucianBuzzo/frenzyscript)
[![Dependency Status](https://img.shields.io/david/LucianBuzzo/frenzyscript.svg)](https://david-dm.org/LucianBuzzo/frenzyscript)

## Example

``` js
var f = require('frenzyscript')
f('div#page',
  f('div#header',
    f('h1.classy', 'h', { style: {'background-color': '#22f'} })),
  f('div#menu', { style: {'background-color': '#2f2'} },
    f('ul',
      f('li', 'one'),
      f('li', 'two'),
      f('li', 'three'))),
    f('h2', 'content title',  { style: {'background-color': '#f22'} }),
    f('p',
      "so it's just like a templating engine,\n",
      "but easy to use inline with javascript\n"),
    f('p',
      "the intention is for this to be used to create\n",
      "reusable, interactive html widgets. "))
```

## On the server

You can still use frenzyscript on the server,
the limitation is that events don't make sense anymore,
but you can use it to generate html:

``` js
console.log(f('h1', 'hello!').outerHTML)
=> '<h1>hello!</h1>'
```

## f (tag, attrs, [text?, Elements?,...])

Create an `HTMLElement`. The first argument must be the tag name, you may use a
fully qualified tagname for building e.g. XML documents: `h('ns:tag').

### classes & id

If the tag name is of form `name.class1.class2#id` that is a shortcut
for setting the class and id.

### default tag name

If the tag name begins with a class or id, it defaults to a `<div>`.

### Attributes

If an `{}` object is passed in it will be used to set attributes.

``` js
var f = require('frenzyscript')
f('a', {href: 'https://npm.im/frenzyscript'}, 'frenzyscript')
```

Note that frenzyscript sets properties on the DOM element object, not
attributes on the HTML element. This makes for better consistency across
browsers and a nicer API for booleans. There are some gotchas, however.
Attributes such as `colspan` are camel cased to `colSpan`, and `for` on the
label element is `htmlFor` to avoid collision with the language keyword. See the
[DOM HTML specification](http://www.w3.org/TR/DOM-Level-2-HTML/html.html)
for details.

### events

If an attribute is a function, then it will be registered as an event listener.

``` js
var f = require('frenzyscript')
f('a', {href: '#',
  onclick: function (e) {
    alert('you are 1,000,000th visitor!')
    e.preventDefault()
  }
}, 'click here to win a prize')
```

### styles

If an attribute has a style property, then that will be handled specially.

``` js
var f = require('frenzyscript')
f('h1.fun', {style: {'font-family': 'Comic Sans MS'}}, 'Happy Birthday!')
```

or as a string

``` js
var f = require('frenzyscript')
f('h1.fun', {style: 'font-family: Comic Sans MS'}, 'Happy Birthday!')
```

You may pass in attributes in multiple positions, it's no problem!

### children - string

If an argument is a string, a TextNode is created in that position.

### children - HTMLElement

If a argument is a `Node` (or `HTMLElement`), for example, the return value of a call to `h`
that's cool, too.

### children - null.

This is just ignored.

### children - Array

Each item in the array is treated like a ordinary child. (string or HTMLElement)
this is useful when you want to iterate over an object:

``` js
var f = require('frenzyscript')
var obj = {
  a: 'Apple',
  b: 'Banana',
  c: 'Cherry',
  d: 'Durian',
  e: 'Elder Berry'
}
f('table',
  f('tr', f('th', 'letter'), f('th', 'fruit')),
  Object.keys(obj).map(function (k) {
    return f('tr',
      f('th', k),
      f('td', obj[k])
    )
  })
)
```

### Cleaning Up

If you need to clean up a widget created using frenzyscript - deregistering all its event handlers and observable listeners, you can use `context()`.

``` js
var f = require('frenzyscript').context()
var o = require('observable')
var text = o()
text('click here to win a prize')
f('a', {href: '#',
  onclick: function (e) {
    text('you are 1,000,000th visitor!')
    e.preventDefault()
  }
}, text)

// then if you want to remove this widget from the page
// to cleanup
f.cleanup()

```

## License

MIT
