import { on } from "../utils/dom";
const ctx = "clickoutSideContent";
const nodeList = [];
let id = 0;
let startClick;

on(document, "mousedown", (e) => (startClick = e));
on(document, "mouseup", (e) => {
  nodeList.forEach((node) => node[ctx].documentHandler(e, startClick));
});
function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (
      !vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))
    ) {
      return;
    }
    if (
      binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]
    ) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn();
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}
export default {
  bind(el, binding, vnode) {
    nodeList.push(el);
    el[ctx] = {
      id: ++id,
      methodName: binding.expression,
      bindingFn: binding.value,
      documentHandler: createDocumentHandler(el, binding, vnode),
    };
  },
  update(el, binding, vnode) {
    el[ctx] = {
      methodName: binding.expression,
      bindingFn: binding.value,
      documentHandler: createDocumentHandler(el, binding, vnode),
    };
  },
  unbind(el) {
    for (let i in nodeList) {
      if (el[ctx].id === nodeList[i][ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  },
};
