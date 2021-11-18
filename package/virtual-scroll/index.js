import VirtualScroll from "./src/virtual-scroll.js";
VirtualScroll.install = function(vue){
    vue.component(VirtualScroll.name, VirtualScroll);
}

export {
    VirtualScroll
};