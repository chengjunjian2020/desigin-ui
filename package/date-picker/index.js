import datePicker from "./src/date-picker.js";
datePicker.install = function(vue) {
  vue.component(datePicker.name, datePicker);
};

export { datePicker };
