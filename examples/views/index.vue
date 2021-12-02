<template>
    <div class="wrapper">
        <RotationScroll>
            <ul>
                <li v-for="item in list" :key="item.id">
                    {{ item }}
                </li>
            </ul>
        </RotationScroll>
    </div>
</template>

<script>
import { RotationScroll } from "desigin-ui/index";
export default {
    data() {
        return {
            list: [],
        };
    },
    components: {
        RotationScroll,
    },
    created() {
        this._initList();
    },
    methods: {
        _initList() {
            for (let i = 0; i < 30; i++) {
                this.list.push(`自动轮播第${i}条`);
            }
        },
    },
};
</script>

<style lang="less" scoped>
.wrapper {
    width: 300px;
    height: 222px;
    overflow: hidden;
    ul li {
        list-style: none;
    }
}
</style>