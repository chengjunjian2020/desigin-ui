<template>
    <div class="wrapper">
        <date-picker v-model="value1" size="small"></date-picker>
        <Model v-model="value1"></Model>
    </div>
</template>

<script>
import { datePicker } from "desigin-ui/index";
import Model from "../components/CustomVModel.vue";
export default {
    data() {
        return {
            value1: "11",
        };
    },
    components: {
        datePicker,
        Model,
    },
    methods: {},
};
</script>

<style lang="less" scoped>
.wrapper {
    ul {
        // display: flex;
        li {
            list-style: none;
            // width: 100px;
        }
    }
}
</style>