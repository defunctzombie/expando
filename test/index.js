var assert = require('assert');
var domify = require('domify');
var expando = require('../');

var container = document.body.appendChild(domify('<div>'));

test('up - no transition', function(done) {
    var elem = domify('<div><p>foo</p><p>bar</p></div>');
    container.appendChild(elem);
    assert(elem.clientHeight);

    expando.collapse(elem, function() {
        assert.equal(elem.clientHeight, 0);
        done();
    });
});

test('up - with transtion', function(done) {
    var elem = domify('<div class="collapsable"><p>foo</p><p>bar</p></div>');
    container.appendChild(elem);
    assert(elem.clientHeight, 'height is non-zero');

    var start = Date.now();
    expando.collapse(elem, function() {
        var end = Date.now();
        assert(end - start >= 900, 'duration elapsed');
        assert.equal(elem.clientHeight, 0);
        done();
    });
});

test('down - no transition', function(done) {
    var elem = domify('<div style="display: none"><p>foo</p><p>bar</p></div>');
    container.appendChild(elem);
    assert(elem.clientHeight === 0);

    expando.expand(elem, function() {
        assert(elem.clientHeight);
        done();
    });
});

test('down - transition', function(done) {
    var elem = domify('<div style="display: none" class="collapsable"><p>foo</p><p>bar</p></div>');
    container.appendChild(elem);
    assert(elem.clientHeight === 0, 'height starts at 0');

    var start = Date.now();
    expando.expand(elem, function() {
        var end = Date.now();
        assert(end - start >= 900, 'duration elapsed');
        assert(elem.clientHeight, 'height is not 0');
        done();
    });
});
