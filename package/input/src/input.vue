<template>
    <div class="desigin-input">
        <slot name="prefix"></slot>
        <input
            class="input-inner"
            :type="type"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
        />
    </div>
</template>

<script>
export default {
    name: "desigin-input",
    props: {
        type: {
            type: String,
            default: "text",
        },
        value: [String, Number],
    },
    data() {
        return {};
    },
    methods: {
        handleInput(e) {
            console.log(e);
        },
        handleFocus() {},
        handleBlur() {},
        handleChange() {},
    },
};
</script>

<style scoped lang="less">
.desigin-input {
    font-size: 13px;
    .input-inner {
        height: 32px;
        line-height: 32px;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: none;
        padding: 0 15px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
    }
}
</style>