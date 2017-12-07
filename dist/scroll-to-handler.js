"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
require("jquery-ui/ui/effect");
var easing = "easeInOutQuart";
var $window = $(window);
var $html = $("html");
var $body = $("body");
var $scrollers = $html.add($body);
var $document = $(document);
var scrollOffsetModifiers = [];
try {
    var currentHashTarget_1 = $(window.location.hash);
    $scrollers.scrollTop(0);
    if (currentHashTarget_1.length) {
        setTimeout(function () {
            scrollToEle(currentHashTarget_1);
        }, 200);
    }
}
catch (err) {
}
var pathname = location.pathname.replace("/index.php", "");
pathname = pathname.replace("/index.html", "");
$document.on("click", "a[href^='" + pathname.replace(/\//g, '\\/') + "#'], " +
    "a[href^='" + (location.protocol + '//' + location.hostname + pathname).replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/:/g, '\\:') + "#'], " +
    "a[href^='" + (location.protocol + '//' + location.hostname + ':' + location.port + pathname).replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/:/g, '\\:') + "#'], " +
    "a[href^='#']", function (e) {
    var el = $(this);
    if (el.data("prevent-scroll")) {
        return;
    }
    var selector = el.attr('href');
    if (selector && selector.substring(0, 1) !== '#') {
        selector = selector.substr(selector.indexOf('#'));
    }
    if (selector.length <= 1) {
        e.preventDefault();
        return;
    }
    var target = $(selector);
    scrollToEle(target);
    history.pushState(null, "", el.attr('href'));
    e.preventDefault();
});
function scrollToEle(target, minDuration, maxDuration) {
    if (minDuration === void 0) { minDuration = 500; }
    if (maxDuration === void 0) { maxDuration = 2000; }
    if (target.length === 0) {
        return $.Deferred().resolve().promise();
    }
    if (target.data("scroll-parent")) {
        var parent_1 = target.parents(":eq(" + target.data("scroll-parent") + ")");
        target = (parent_1.length > 0) ? parent_1 : target;
    }
    var offset = Math.min(target.offset().top, maxScrollTop());
    offset = applyScrollOffsetModifiers(offset, target);
    var scrollTop = Math.max($html.scrollTop(), $body.scrollTop());
    var duration = Math.max(Math.min(Math.abs(offset - scrollTop) / 2, maxDuration), minDuration);
    return $scrollers.stop().animate({ scrollTop: offset + 'px' }, {
        duration: duration,
        easing: easing
    }).promise();
}
function maxScrollTop() {
    return $document.height() - $window.height();
}
function applyScrollOffsetModifiers(offset, target) {
    var scrollToCenter = target.data('scroll-to-center');
    if (scrollToCenter) {
        var toh = target.outerHeight(true);
        var wh = $window.height();
        if (toh < wh) {
            var tmp = target.offset().top + (toh / 2) - (wh / 2);
            offset = Math.min(tmp, maxScrollTop());
        }
    }
    var offsetModifier = target.data('scroll-offset');
    if (typeof offsetModifier !== "undefined") {
        offset -= offsetModifier;
    }
    for (var _i = 0, scrollOffsetModifiers_1 = scrollOffsetModifiers; _i < scrollOffsetModifiers_1.length; _i++) {
        var scrollOffsetModifier = scrollOffsetModifiers_1[_i];
        offset = scrollOffsetModifier(offset, target);
    }
    return offset;
}
function addScrollOffsetModifier(modifier) {
    scrollOffsetModifiers.push(modifier);
    return function removeScrollOffsetModifier() {
        scrollOffsetModifiers = scrollOffsetModifiers.filter(function (ele) {
            return ele !== modifier;
        });
    };
}
exports.default = {
    scrollToEle: scrollToEle,
    maxScrollTop: maxScrollTop,
    applyScrollOffsetModifiers: applyScrollOffsetModifiers,
    addScrollOffsetModifier: addScrollOffsetModifier
};
