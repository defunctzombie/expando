# expando [![Build Status](https://travis-ci.org/defunctzombie/expando.png)](https://travis-ci.org/defunctzombie/expando)

expand/collapse html elements with variable height

## example

```html
<div class="collapsible">
    <p>foo</p>
    <p>bar</p>
</div>
```

```cs
.collapsible {
    transition: height 1s ease;
    overflow-y: hidden;
}
```

```js
var expando = require('expando');

var div = document.querySelector('.collapsible');

expando.collapse(div, function() {
    // callback when done!
});
```

## why?

CSS height transitions are great for making collapsing widgets but they have one major shortcoming. They are unable to transition to/from height 0 and a variable height.

Historically, you could accomplish this functionality via jquery.slide[Toggle|Up|Down]() but this would use javascript to manipulate the height of the element instead of css for various reasons, better cross browser support being the major one.

Due to the current CSS height transition limitations, various "hacks" are nedded in order to make use of CSS height transitions. This module does those hacks, allowing you to use `transition: height` in your css.

## how it works

### To slide down

> from a `display: none` state

The library first gets the current actual height of the element by setting `display: block` then reading the `clientHeight` and then setting the `height` to 0. All of this causes no display updates since js code never gives up execution. However, reading `clientHeight` does cause a reflow so that the proper height can be read without uncovering the element.

After setting `height` to 0, we force another reflow and then set the `height` to the `clientHeight` we read earlier. This will now trigger the transition from the current height `0` to the new known height (allowing css transitions to work).

We also listen on transition end events to then remove the fixed height we set in order to allow the element to flow as needed once it has been expanded.

### To slide up

Sliding up is a bit easier. We read the current height. We then disable transtions (this is important due to some quirks in browsers). We set the height to 0 and wait for transition to end.

## api

### collapse(HTMLElement [, function])

Collapse the html element to height 0. The speed and timing are determined by the transition you specify in your stylesheets.

### expand(HTMLElement [, function])

Expand the html element from height 0. The speed and timing are determined by the transition you specify in your stylesheets.

## supported browsers

Browsers with support for CSS `transition` animations (prefixed or not) are supported.

The test suite is run in IE 10+, Chrome 28+, Firefox, Opera, Safari.

## tips

Make sure you don't forget to define the transition in your stylesheet. Without a transition the library will fallback to instantly opening and closing.

Make sure that you don't forget `overflow-y: hidden;` in your stylesheet. The library will automatically handle this but it behaves better if you have it.

# License

MIT
