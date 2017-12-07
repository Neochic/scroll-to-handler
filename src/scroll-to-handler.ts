import * as $ from 'jquery';
import "jquery-ui/ui/effect";

const easing = "easeInOutQuart";

const $window = $(window);
const $html = $("html");
const $body = $("body");
const $scrollers = $html.add($body);
const $document = $(document);

let scrollOffsetModifiers: Array<ScrollOffsetModifierInterface> = [];

try {
    let currentHashTarget = $(window.location.hash);
    $scrollers.scrollTop(0);
    if (currentHashTarget.length) {
        setTimeout(function () {
            scrollToEle(currentHashTarget);
        }, 200);
    }
} catch (err) {
}


let pathname = location.pathname.replace("/index.php", "");
pathname = pathname.replace("/index.html", "");

$document.on("click", "a[href^='" + pathname.replace(/\//g, '\\/') + "#'], " +
    "a[href^='" + (location.protocol + '//' + location.hostname + pathname).replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/:/g, '\\:') + "#'], " +
    "a[href^='" + (location.protocol + '//' + location.hostname + ':' + location.port + pathname).replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/:/g, '\\:') + "#'], " +
    "a[href^='#']", function (e) {

    let el = $(this);
    if (el.data("prevent-scroll")) {
        return;
    }
    let selector = <string> el.attr('href');
    if (selector && selector.substring(0, 1) !== '#') {
        selector = selector.substr(selector.indexOf('#'));
    }
    if (selector.length <= 1) {
        e.preventDefault();
        return;
    }
    let target = $(selector);
    scrollToEle(target);
    history.pushState(null, "", el.attr('href'));
    e.preventDefault();
});

function scrollToEle(target: JQuery, minDuration: number = 500, maxDuration: number = 2000): JQueryPromise<any> {
    if (target.length === 0) {
        return $.Deferred().resolve().promise();
    }

    if (target.data("scroll-parent")) {
        let parent = target.parents(`:eq(${target.data("scroll-parent")})`);
        target = (parent.length > 0) ? parent : target;
    }

    let offset = Math.min(target.offset().top, maxScrollTop());

    offset = applyScrollOffsetModifiers(offset, target);

    let scrollTop = Math.max($html.scrollTop(), $body.scrollTop());
    let duration = Math.max(Math.min(Math.abs(offset - scrollTop) / 2, maxDuration), minDuration);


    return $scrollers.stop().animate({scrollTop: offset + 'px'}, {
        duration: duration,
        easing: easing
    }).promise();
}

function maxScrollTop(): number {
    return $document.height() - $window.height();
}

function applyScrollOffsetModifiers(offset: number, target: JQuery): number {
    let scrollToCenter = target.data('scroll-to-center');
    if (scrollToCenter) {
        let toh = target.outerHeight(true);
        let wh = $window.height();
        if (toh < wh) {
            let tmp = target.offset().top + (toh / 2) - (wh / 2);
            offset = Math.min(tmp, maxScrollTop());
        }
    }

    let offsetModifier = <number> target.data('scroll-offset');
    if (typeof offsetModifier !== "undefined") {
        offset -= offsetModifier;
    }
    for (let scrollOffsetModifier of scrollOffsetModifiers) {
        offset = scrollOffsetModifier(offset, target);
    }
    return offset;
}

function addScrollOffsetModifier(modifier: ScrollOffsetModifierInterface): ScrollOffsetRemoverInterface {
    scrollOffsetModifiers.push(modifier);
    return function removeScrollOffsetModifier() {
        scrollOffsetModifiers = scrollOffsetModifiers.filter(function (ele) {
            return ele !== modifier;
        });
    };
}

export default {
    scrollToEle,
    maxScrollTop,
    applyScrollOffsetModifiers,
    addScrollOffsetModifier
};
