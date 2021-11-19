import Virtual from "./virtual";
import Slot from "./slot";
export default {
  name: "virtual-scroll",
  props: {
    dataSource: {
      //数据列表
      type: Array,
      required: true,
    },
    dataKey: {
      type: [String, Number],
      required: true,
    },
    refName: {
      // 用于操作组件对象
      type: String,
      required: true,
    },
    rootTag: {
      //根节点渲染的标签
      type: String,
      default: "div",
    },
    renderTag: { //每个item的标签
      type: String,
      default: "div",
    },
    wrapTag: {
      //虚拟滚动列表的容器标签
      type: String,
      default: "div",
    },
    preloadSize: {
      type: Number,
      default: 30,
    },
    itemSize: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      virtualInfo: {},
    };
  },
  watch:{
    'dataSource.length'(){
      this.virtual.updateParam();
      this.virtual.handleDataSourcesChange();
    }
  },
  computed:{
    className(){
      return this.wrapClass ? [this.wrapClass, 'sh-virtual-content-wrap']:['sh-virtual-content-wrap'];
    }
  },
  created() {
    this.initVirtual();
  },
  methods: {
    initVirtual() {
      this.virtual = new Virtual(
        {
          keeps: this.preloadSize, //渲染多少条数据
          uniqueIds: this.getUniqueIds(), // 数据源
          buffer: Math.round(this.preloadSize / 3), // 缓存数值 例如这一次滚动后所得下标不足时不做计算处理，向上滚动利用该数值做滚动优化
          estimateSize: this.itemSize, // 每行高度
        },
        this.handlerUpdate
      );
    },
    getUniqueIds() {
      return this.dataSource.map((data) => data[this.dataKey]);
    },
    handlerUpdate(virtualInfo) {
      this.virtualInfo = virtualInfo;
    },
    setChildNode(h, slot, tag) {
      const childNode = [];
      const { dataKey, dataSource } = this;
      let { start, end } = this.virtualInfo;
      while (start <= end) {
        let dataSources = dataSource[start];
        if (dataSources) {
          if (Object.prototype.hasOwnProperty.call(dataSources, dataKey)) {
            childNode.push(
              h(
                Slot,
                {
                  props: {
                    index: start,
                    source: dataSources,
                    uniqueKey: dataSource[dataKey],
                    renderTag: tag,
                  },
                },
                slot({
                  source: dataSources,
                  index: start,
                })
              )
            );
          } else {
            console.warn(
              `Cannot get the data-key '${dataKey}' from data-sources.`
            );
          }
        } else {
          console.warn(`Cannot get the index '${start}' from data-sources.`);
        }
        start++;
      }
      return childNode;
    },
    handlerScrolls(event) {
      const offset = this.getOffset(event.target); //获取滚动的高度
      const clientSize = this.getClientSize(event.target); //
      const scrollSize = this.getScrollSize(event.target);
      if (offset < 0 || (offset + clientSize > scrollSize) || !scrollSize) { //没有复现
        return
      }
      this.virtual.handleScroll(offset);
    },

    getOffset(target){
      const el = target || this.$refs[this.refName];
      return el.scrollTop || 0;
    },

    getClientSize(target){
      const el = target || this.$refs[this.refName]
      return el ? el.clientHeight : 0
    },
    getScrollSize(target){
      const el = target || this.$refs[this.refName]
      return el.scrollHeight || 0
    }
  },
  render(h) {
    const { model } = this.$scopedSlots;
    if (!model) {
      console.error("请传入渲染组件");
      return;
    }
    const {
      renderTag,
      virtualInfo,
      refName,
      rootTag,
      wrapTag,
      className,
    } = this;
    const children = this.setChildNode(h, model, renderTag);
    const wrapStyle = {
      padding: `${virtualInfo.padFront}px 0px ${virtualInfo.padBehind}px`,
    };
    return h(
      rootTag,
      {
        ref: refName,
        on: {
          "&scroll": this.handlerScrolls,
        },
        class: "sh-virtual",
      },
      [
        h(
          wrapTag,
          {
            style: wrapStyle,
            class: className,
          },
          children
        ),
      ]
    );
  },
  beforeDestroy(){
    this.virtual.destroy()
  }

};
