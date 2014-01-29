
var notransition = ' expando-no-transition';

function transition_prop(element) {
    // need to see if we have any transitions that will run
    // if we don't, transition end events won't fire
    // we can just go right to hiding
    var computed = window.getComputedStyle(element);
    return computed.transitionProperty ||
        computed.WebkitTransitionProperty ||
        computed.MozTransitionProperty ||
        computed.OTransitionProperyy ||
        computed.MsTransitionProperty;
};

function slide_up(element, done) {
    done = done || function() {};

    var style = element.style;
    var prop = 'height';

    // need to see if we have any transitions that will run
    // if we don't, transition end events won't fire
    // we can just go right to hiding
    var transition = transition_prop(element);
    if (!transition || transition.indexOf(prop) < 0) {
        style['display'] = 'none';
        return done();
    }

    var height = element.clientHeight;
    if (height === 0) {
        return;
    }

    // disable transitions
    element.className += notransition;

    // set the current height explicitly to transition it
    style[prop] = height + 'px';
    style['overflow-y'] = 'hidden';

    element.clientHeight; // force reflow
    element.className = element.className.replace(notransition, '');

    // timeout allows the dom to render
    // if we set height immediately, then dom would not change
    // and transition would not trigger
    bind_transitions(element, clear);
    style[prop] = '0px';

    // when transition ends, we need to set height back
    // and hide the element
    // TODO maybe add a class?
    function clear(ev) {
        // only care about height transitions
        if (ev.propertyName !== prop) {
            return;
        }

        unbind_transitions(element, clear);

        style['display'] = 'none';
        style.removeProperty(prop);

        done();
    }
}

function slide_down(element, done) {
    var style = element.style;
    done = done || function() {};

    var visible_display = 'block';
    var prop = 'height';

    // without a transition, we can simply expand
    var transition = transition_prop(element);
    if (!transition || transition.indexOf(prop) < 0) {
        style['display'] = visible_display;
        return done();
    }

    // by turning on the display, we get a correct client height
    // but the browser doesn't render it yet!!
    style['display'] = visible_display;
    var height = element.clientHeight;

    // set height AFTER getting target height
    style[prop] = 0;

    element.clientHeight; // force reflow
    style[prop] = height + 'px';
    style['overflow-y'] = 'hidden';
    bind_transitions(element, clear);

    function clear(ev) {
        // only care about height transitions
        if (ev.propertyName !== prop) {
            return;
        }

        unbind_transitions(element, clear);

        element.className += notransition;
        element.clientHeight; // force reflow
        style.removeProperty(prop);
        //style.removeProperty('overflow-y');
        element.clientHeight; // force reflow
        element.className = element.className.replace(notransition, '');
        done();
    }
}

function bind_transitions(element, fn) {
    element.addEventListener('transitionend', fn);
    element.addEventListener('mozTransitionEnd', fn);
    element.addEventListener('webkitTransitionEnd', fn);
    element.addEventListener('msTransitionEnd', fn);
    element.addEventListener('oTransitionEnd', fn);
}

function unbind_transitions(element, fn) {
    element.removeEventListener('oTransitionEnd', fn);
    element.removeEventListener('msTransitionEnd', fn);
    element.removeEventListener('webkitTransitionEnd', fn);
    element.removeEventListener('mozTransitionEnd', fn);
    element.removeEventListener('transitionend', fn);
}

// inject the no-transition stylesheet rule
var style = document.createElement('style');
document.head.appendChild(style);
style.appendChild(document.createTextNode(''));
var rule = '-webkit-transition: none !important;\n' +
    '-moz-transition: none !important;\n' +
    '-o-transition: none !important;\n' +
    '-ms-transition: none !important;\n' +
    'transition: none !important;';
style.sheet.insertRule('.expando-no-transition { ' + rule + ' }', 0);

module.exports.collapse = slide_up;
module.exports.expand = slide_down;
