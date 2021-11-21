// const CALC_TYPE = {
//   INIT: "INIT",
//   FIXED: "FIXED",
//   DYNAMIC: "DYNAMIC",
// };
const DIRECTION_TYPE = {
  FRONT: "FRONT", // 向上滚动
  BEHIND: "BEHIND", // 向下滚动
};
export default class Virtual {
  constructor(param, cb) {
    this.init(param, cb);
  }
  //初始化
  init(param, cb) {
    this.param = param;
    this.cb = cb;

    this.offset = 0; // 初始化滚动条的offsetTop值
    this.direction = null;
    // this.sizes = new Map();
    this.range = Object.create(null);
    if (param) {
      this.checkRange(0, param.keeps - 1);
    }
  }
  //触发滚动操作
  handleScroll(offset) {
    this.direction = offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND
    this.offset = offset

    if (this.direction === DIRECTION_TYPE.FRONT) {
      this.handleFront()
    } else if (this.direction === DIRECTION_TYPE.BEHIND) {
      this.handleBehind()
    }
  }
  isFront(){
    return this.direction === DIRECTION_TYPE.FRONT;
  }
  isBehind () {
    return this.direction === DIRECTION_TYPE.BEHIND
  }
  handleFront() {
    const overs = this.getScrollOvers();
    let { start } = this.range;
    const { buffer } = this.param;
    if (overs > start) {
      return
    }
    const starts = Math.max(overs - buffer, 0);
    this.checkRange(starts, this.getEndByStart(starts));
  }
  handleBehind() {
    const overs = this.getScrollOvers();
    const { start } = this.range;
    const { buffer } = this.param;
    if (overs < start + buffer) {
      //滚动的如果小于start+buffer代表不需要改变padding，自身的内容已经够展示，不需要做其他渲染操作
      return;
    }
    this.checkRange(overs, this.getEndByStart(overs));
  }
  // 更新参数
  updateParam(key, value) {
    this.param[key] = value;
  }
  //更新padding
  handleDataSourcesChange() {
    let { start } = this.range;
    this.checkRange(start, this.getEndByStart(start));
  }
  getEndByStart(start) {
    let { keeps } = this.param;
    let end = start + keeps - 1;
    end = Math.min(end, this.getLastIndex());
    return end;
  }
  getScrollOvers() {
    let { offset } = this;
    if (offset <= 0) {
      return 0
    }
    let low = 0
    let middle = 0
    let middleOffset = 0
    let high = this.param.uniqueIds.length
    while (low <= high) {
      middle = low + Math.floor((high - low) / 2)
      middleOffset = this.getIndexOffset(middle)

      if (middleOffset === offset) {
        return middle
      } else if (middleOffset < offset) {
        low = middle + 1
      } else if (middleOffset > offset) {
        high = middle - 1
      }
    }
    return low > 0 ? --low : 0
  }
  //设置start与end的逻辑
  checkRange(start, end) {
    let { keeps, uniqueIds } = this.param;
    const total = uniqueIds.length;
    if (total < keeps) {
      start = 0;
      end = this.getLastIndex();
    } else if (end - start < keeps - 1) {
      start = end - keeps + 1;
    }
    if (this.range.start !== start) {
      this.updateRange(start, end);
    }
  }
  //获取长度
  getLastIndex() {
    return this.param.uniqueIds.length - 1;
  }
  /**
   * @param {number} start
   * @param {number} end
   * 修复range对象值并计算padFront与padBehind对应上padding与下padding
   */
  updateRange(start, end) {
    this.range = {
      start,
      end,
      padFront: this.getPadFront(start), //上边距
      padBehind: this.getPadBehind(end), //下边距
    };
    this.cb(this.getVirtualInfo());
  }
  //返回range对象
  getVirtualInfo() {
    const range = Object.create(null);
    range.start = this.range.start;
    range.end = this.range.end;
    range.padFront = this.range.padFront; // padding-top高度
    range.padBehind = this.range.padBehind;
    return range;
  }
  /**
   * 获取上padding值
   * @param {number} start
   * @returns
   */
   getPadFront (start) {
      return this.getIndexOffset(start)
  }
  /**
   * 获取下padding值
   * @param {number} end
   * @returns
   */
   getPadBehind (end) {
    const lastIndex = this.getLastIndex()

    // if (this.isFixedType()) {
    //   return (lastIndex - end) * this.fixedSizeValue
    // }

    if (this.lastCalcIndex === lastIndex) {
      return this.getIndexOffset(lastIndex) - this.getIndexOffset(end)
    } else {
      return (lastIndex - end) * this.getEstimateSize()
    }
  }

  // isFixedType() {
  //   return this.calcType === CALC_TYPE.FIXED;
  // }
  /**
   * 通过下标计算出偏移量offset
   * @param {number} givenIndex
   * @returns
   */
  getIndexOffset(givenIndex) {
    if (!givenIndex) {
      return 0;
    }
    let offset = 0;
    // let indexSize = 0;
    for (let index = 0; index < givenIndex; index++) {
      // indexSize = this.sizes.get(this.param.uniqueIds[index]);
      // offset =
      //   offset +
      //   (typeof indexSize === "number" ? indexSize : this.getEstimateSize());
      offset = offset +this.getEstimateSize();
    }

    this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
    this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex());
    return offset;
  }
  // 获取高度
  getEstimateSize() {
    // return this.isFixedType()
    //   ? this.fixedSizeValue
    //   : this.firstRangeAverageSize || this.param.estimateSize;
    return this.param.estimateSize;
  }
  // 销毁
  destroy() {
    this.init(null, null);
  }
}
