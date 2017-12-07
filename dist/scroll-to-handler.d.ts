/// <reference types="jquery" />
/// <reference types="jqueryui" />
import "jquery-ui/ui/effect";
declare const _default: {
    scrollToEle: (target: JQuery<HTMLElement>, minDuration?: number, maxDuration?: number) => JQueryPromise<any>;
    maxScrollTop: () => number;
    applyScrollOffsetModifiers: (offset: number, target: JQuery<HTMLElement>) => number;
    addScrollOffsetModifier: (modifier: (fn: number, JQuery?: any) => number) => () => void;
};
export default _default;
