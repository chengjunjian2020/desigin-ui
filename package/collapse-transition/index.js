import collapseTransition from "./src/collapse-transition";
collapseTransition.install = function(vue) {
  vue.component(collapseTransition.name, collapseTransition);
};
export { collapseTransition };
