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
          step: 1, // 步长每次滚动多少px,
          hoverStop: true, // 是否启用鼠标hover控制
          direction: "bottom", // 方向 top left bottom right
          openTouch: false, // 是否开启touch滑动
          waitTime: 100, // 每次停止等待时间
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
        this.computePos();
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
    computePos() {
      const scrollHeight = this.getScrollHeight();
      const clientSize = this.getClientSize();
      const { step, direction, waitTime } = this.scrollOption;
      let yPos = this.yPos;
      this.times = setInterval(() => {
        yPos = Math.min(scrollHeight - clientSize, yPos + step);
        if (Math.abs(yPos) === scrollHeight - clientSize) {
          yPos = clientSize;
        }
        switch (direction) {
          case "top":
            this.yPos = yPos;
            break;
          case "bottom":
            this.yPos = yPos * -1;
            break;
          case "left":
            break;
          case "right":
            break;
        }
      }, waitTime);
    },
    /**
     * 需要处理的vnode
     * @param {*} childrenx
     */
    setChildVnode(children) {
      let { preloadSize, yPos } = this;
      const scrollHeight = this.getScrollHeight();
      const clientSize = this.getClientSize();
      if (preloadSize >= scrollHeight - clientSize - Math.abs(yPos)) {
        const leng = this.list.length;
        const vNodeList = children[0].children;
        children[0].children.push(...vNodeList);
        if (Math.floor(children[0].children.length / 2) >= leng) {
          children[0].children.splice(0, leng - 1);
        }
      }
    },
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
