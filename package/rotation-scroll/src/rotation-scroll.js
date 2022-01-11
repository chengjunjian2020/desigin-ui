// 先暂时实现这几种 后面还要提供左右 或者上下的插槽 各个class名称 传给父组件回调函数 on-scroll scroll-end 停止函数
import "./index.less";
export default {
  name: "rotation-scroll",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    refName: {
      type: String,
      default: "rotationScroll",
    },
    wrapperClass: {
      type: String,
      default: "",
    },
    scrollClass: {
      type: String,
      default: "",
    },
    preloadSize: {
      // 距离末尾多少px开启预加载
      type: Number,
      default: 0,
    },
    scrollOption: {
      type: Object,
      default: () => {
        return {
          step: 0.4, // 步长每次滚动多少px,
          hoverStop: true, // 是否启用鼠标hover控制
          direction: "top", // 方向 top left bottom right
          openTouch: false, // 是否开启touch滑动
          waitTime: 10, // 每次停止等待时间
          autoPlay: true, // 是否开启自动滚动
          switchOffset: 10, // 手动切换时的的长度
        };
      },
    },
  },
  data() {
    return {
      xPos: 0,
      yPos: 0,
      times: null,
      reqFrame: null,
    };
  },
  created() {
    this.initScroll();
  },
  computed: {
    infiniteStyle() {
      // const { direction } = this.scrollOption;
      const { xPos, yPos } = this;
      return `transform: translate(${xPos},${yPos}px)`;
    },
  },
  methods: {
    initScroll() {
      this.$nextTick(() => {
        const clientSize = this.getClientSize();
        const scrollHeight = this.getScrollHeight();
        //表示不能滚动
        if (clientSize >= scrollHeight || !this.scrollOption.autoPlay) {
          return;
        }
        let ypos = this.yPos;
        this.loopScroll(ypos);
      });
    },
    getClientSize() {
      const el = this.$refs[this.refName];
      return el ? el.clientHeight : 0;
    },
    getScrollHeight() {
      const el = this.$refs[this.refName];
      return el ? el.scrollHeight : 0;
    },
    loopScroll(yPos) {
      // eslint-disable-next-line no-unused-vars
      const { step, direction, waitTime } = this.scrollOption;
      const scrollHeight = this.getScrollHeight();
      const clientSize = this.getClientSize();
      this._clear();
      this.reqFrame = requestAnimationFrame(() => {
        yPos = Math.min(scrollHeight - clientSize, yPos + step);

        switch (direction) {
          case "top":
            if (Math.abs(yPos) === scrollHeight - clientSize) {
              yPos = scrollHeight / 2 - clientSize;
            }
            this.yPos = -yPos;
            break;
          case "bottom":
            if (Math.abs(yPos) === scrollHeight - clientSize) {
              yPos = scrollHeight / 2 - clientSize;
            }
            this.yPos = yPos * -1;

            break;
          case "left":
            break;
          case "right":
            break;
        }

        this.loopScroll(yPos);
      });
    },
    /**
     * 需要处理的vnode
     * @param {*} childrenx
     */
    setChildVnode(children) {
      // let { preloadSize, yPos, list } = this;
      // let { direction } = this.scrollOption;
      // const scrollHeight = this.getScrollHeight();
      // const clientSize = this.getClientSize();
      const { list } = this;
      const vNodeList = children[0].children;
      if (list.length === vNodeList.length) {
        children[0].children.push(...vNodeList);
      }
    },
    _clear() {
      this.reqFrame && cancelAnimationFrame(this.reqFrame);
    },
  },
  beforeDestroy() {
    this._clear();
  },
  render(h) {
    const { infiniteStyle, refName, wrapperClass, scrollClass } = this;
    const scorllContent = this.$slots.default;
    if (!scorllContent && scorllContent.length > 0) {
      console.error("请传入渲染组件");
      return;
    }
    // eslint-disable-next-line no-unused-vars
    let children = this.setChildVnode(scorllContent);
    return h(
      "div",
      {
        style: infiniteStyle,
        ref: refName,
        class: `rotation-scroll ${wrapperClass}`,
      },
      [
        h(
          "div",
          {
            ref: "scrollRef",
            style: {
              color: "red",
            },
            class: scrollClass,
          },
          scorllContent
        ),
      ]
    );
  },
};
