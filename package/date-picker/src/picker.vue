<template>
    <div>
        <el-input
            :value="date"
            class="date-editor"
            :size="size"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="(value) => (date = value)"
            ref="pickerInput"
            v-clickoutside="handleClose"
        >
            <i slot="prefix" class="el-input__icon el-icon-date"></i>
        </el-input>
    </div>
</template>

<script>
import Vue from "vue";
import Clickoutside from "@/directive/clickoutside";
import { checkData } from "@/utils/date-utils";
export default {
    model: {
        prop: "value", // 对应 props text1
        event: "change",
    },
    directives: { Clickoutside },
    props: {
        value: {},
        size: String,
    },
    data() {
        return {
            date: "",
        };
    },
    watch: {
        value: {
            handler() {
                this.handleBlur();
            },
            immediate: true,
        },
    },
    mounted() {
        this.handleBlur();
    },
    methods: {
        handleBlur() {
            const value = this.value;
            let tempIsValid = true;
            if (!value || value.trim() === "" || !checkData(value, "-")) {
                tempIsValid = false;
            }
            if (tempIsValid) {
                this.date = value;
            } else {
                this.date = "";
            }
            this.$nextTick(() => {
                if (this.picker) {
                    this.picker.value = this.date;
                }
            });
        },
        handleFocus(el) {
            this.showPopper(el);
        },
        showPopper(el) {
            if (!this.picker) {
                this.mountedPanel();
            }
            this.picker.visible = true;
            this.updatePoper(el);
        },
        mountedPanel() {
            this.picker = new Vue(this.panel).$mount();
            this.handleBlur();
            this.picker.$on("change", (cell) => {
                const { year, month, day } = cell;
                this.$emit("change", `${year}-${month}-${day}`);
                this.handleClose();
            });
            document.body.appendChild(this.picker.$el);
            this.popperElm = this.picker.$el;
        },
        updatePoper(el) {
            let { top, left, height } = el.srcElement.getBoundingClientRect();
            //设置样式
            this.$nextTick(() => {
                let element = this.picker.$el;
                element.style.position = "absolute";
                element.style.top = `${top + height}px`;
                element.style.left = `${left}px`;
                element.style.zIndex = `999`;
            });
        },
        handleClose() {
            if (!this.picker || !this.picker.visible) {
                return;
            }
            this.picker.visible = false;
        },
    },
    beforeDestroy() {
        // this.picker.$beforeDestroy();
    },
};
</script>

<style lang="less" scoped>
</style>