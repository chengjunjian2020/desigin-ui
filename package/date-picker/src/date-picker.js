import DatePanel from "./date-panel.vue";
import picker from "./picker";
const getPanel = function(type) {
  if (type === "date") {
    return DatePanel;
  }
  return DatePanel;
};
export default {
  mixins: [picker],
  props: {
    type: {
      type: String,
      default: "date",
    },
  },
  mounted() {
    this.panel = getPanel(this.type);
  },
};
