# HyperScript

Create HyperText with JavaScript.

## Example

``` js
var h = require('hyperscript')

h('div#page',
  h('div#header',
    h('h1.classy', 'h')),
  h('div#menu', { style: { float: 'left', width: '200px' } },
    h('ul',
      h('li', 'one'),
      h('li', 'two'),
      h('li', 'three'))),
  h('div#content', {style: {float: 'left'} },
    h('h2', 'content title'),
    h('p', 
      "so it's just like a templating engine,\n",
      "but easy to use inline with javascript\n"),
    h('p', 
      "the intension is for this to be used to create\n",
      "reusable, interactive html widgets. ")))
```

## h (tag, attrs, [text?, Elements?,...])

Create an `HTMLElement`. first argument must be the tag name.

### classes & id

If the tag name is of form `name.class1.class2#id` that is a short cut
for setting the class and id.

### attributes

If an `{}` object is passed in, it's values will be used to set attributes.

``` js
var h = require('hyperscript')

h('a', {href: 'https://npm.im/h'}, 'h')
```

### events

If an attribute is a function, then it will be registered as an event listener.

``` js
var h = require('hyperscript')

h('a', {href: '#', onclick: function () {
  alert('you are 1,000,000th visitor!'
  return false
}, 'click here to win a prize')

```

### styles

If an attribute has a style property, then that will be handled specially.

``` js
var h = require('hyperscript')

h('h1.fun', {style: {font: 'Comic Sans MS'}}, 'happy birthday!')

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
this is uesful when you want to iterate over an object:

```
var h = require('hyperscript')

h('table',
  Object.keys(window).map(function (k) {
    return h('tr'
      h('th', k),
      h('td', obj[k].toString())
    )
  })
```

## License

MIT
