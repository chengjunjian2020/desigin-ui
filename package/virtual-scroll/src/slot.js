// 包装slot，变为组件后面设置事件
export default {
    name: 'itme-slot',
    props:{
        renderTag: String,
        uniqueKey: [String, Number],
        source: Object,
        index: Number,
    },
    render(h){
        if(this.$slots.default.length>1){
            if(!this.renderTag) throw Error('请传递包裹slot的tag-name')
            return h(this.renderTag, this.$slots.default)
        }
        return this.$slots.default[0]
    }
}