import DatePanel from "./date-panel.vue";
import DateRange from "./date-range.vue";
import picker from "./picker";
const getPanel = function(type) {
  if (type === "date") {
    return DatePanel;
  } else if (type === "daterange") {
    return DateRange;
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
