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
          direction: "bottom", // 方向 top left bottom right
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
  watch: {
    list: {
      deep: true,
      handler() {
        this.initScroll();
      },
    },
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
            this.yPos = yPos;
            break;
          case "bottom":
            if (Math.abs(yPos) === scrollHeight - clientSize) {
              yPos = scrollHeight / 2 - clientSize;
            }
            break;
          case "left":
            break;
          case "right":
            break;
        }
        this.yPos = yPos * -1;

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
        const leng = list.length;
        children[0].children.push(...vNodeList);
        if (Math.floor(children[0].children.length / 2) >= leng) {
          children[0].children.splice(0, leng - 1);
        }
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
    const { infiniteStyle, refName } = this;
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
        class: "rotation-scroll",
      },
      [
        h(
          "div",
          {
            ref: "scrollRef",
            style: {
              color: "red",
            },
          },
          scorllContent
        ),
      ]
    );
  },
};
