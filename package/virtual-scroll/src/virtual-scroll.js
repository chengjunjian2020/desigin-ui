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
    renderTag: {
      //每个item的标签
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
    footerSize: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      virtualInfo: {},
      observerInstance: null,
      isFirstObserver: true,
    };
  },
  watch: {
    "dataSource.length"() {
      this.virtual.updateParam();
      this.virtual.handleDataSourcesChange();
    },
  },
  computed: {
    className() {
      return this.wrapClass
        ? [this.wrapClass, "sh-virtual-content-wrap"]
        : ["sh-virtual-content-wrap"];
    },
  },
  created() {
    this.initVirtual();
  },
  mounted() {
    this.initObserver();
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
    initObserver() {
      this.observerInstance = new IntersectionObserver(
        (entries) => {
          entries.forEach((val) => {
            //避免有的时候一渲染页面就会触发，模拟只有滚动时候才发生
            if (this.isFirstObserver) {
              setTimeout(() => {
                this.isFirstObserver = false;
              }, 800);
              return;
            }
            const attributes = val.target.attributes;
            // isIntersecting标记元素是否进入可视区域
            if (val.isIntersecting && attributes) {
              if (attributes && attributes["name"] === "virtual-header") {
                this.$emit("on-header");
              }
              if (attributes && attributes["name"] === "virtual-footer") {
                this.$emit("on-footer");
              }
            }
            console.log(val);
          });
        },
        {
          root: null, // 默认值为null，也就是视口区域,表示监听的可视区域为整个视口，也就是浏览器的可视区域
          threshold: [1], // 属性决定了什么时候触发回调函数。默认为[0] 比如，[0, 0.25, 0.5, 0.75, 1]就表示当目标元素 0%、25%、50%、75%、100% 可见时，会触发回调函数。
          rootMargin: "0px", // 定义根元素的margin,用来扩展可视区的范围,或者可以这样理解，root元素，多了一个margin属性，如果没有这个margin属性，ele元素只有与root元素开始交叉时才会触发可视性的变化，而这个rootMargin属性的话，就是当ele元素与root元素的外边距交叉时，就会触发ele元素的可视性变化。
        }
      );
      let ref = this.$refs;
      if (ref["virtual-header"]) {
        this.observerInstance.observe(ref["virtual-header"]);
      }
      if (ref["virtual-footer"]) {
        this.observerInstance.observe(ref["virtual-footer"]);
      }
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
      if (offset < 0 || offset + clientSize > scrollSize || !scrollSize) {
        //没有复现
        return;
      }
      this.virtual.handleScroll(offset);
      this.emitScrollEvent(event, offset);
    },
    emitScrollEvent(event, offset) {
      this.$emit("on-scroll", event, this.virtual.getVirtualInfo());
      if (this.virtual.isFront() && this.dataSource.length) {
        this.$emit("on-top", offset);
      }
      if (this.virtual.isBehind() && this.dataSource.length) {
        this.$emit("on-bottom", offset);
      }
    },
    getOffset(target) {
      const el = target || this.$refs[this.refName];
      return el.scrollTop || 0;
    },

    getClientSize(target) {
      const el = target || this.$refs[this.refName];
      return el ? el.clientHeight : 0;
    },
    getScrollSize(target) {
      const el = target || this.$refs[this.refName];
      return el.scrollHeight || 0;
    },
  },
  render(h) {
    const { model, footer = () => {}, header = () => {} } = this.$scopedSlots;
    console.log(footer);
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
          "div",
          {
            ref: "virtual-header",
            attrs: {
              name: "virtual-header",
            },
          },

          header()
        ),
        h(
          wrapTag,
          {
            style: wrapStyle,
            class: className,
          },
          children
        ),
        h(
          "div",
          {
            ref: "virtual-footer",
            attrs: {
              name: "virtual-footer",
            },
          },
          footer()
        ),
      ]
    );
  },
  beforeDestroy() {
    this.virtual.destroy();
    this.observerInstance.disconnect();
  },
};
