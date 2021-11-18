<template>
    <div class="infinity-sroll-container">
        <VirtualScroll
            style="height: 400px; box-shadow: 2px 2px 20px #332e2d"
            :data-source="lists"
            data-key="id"
            ref-name="virtual"
        >
            <template v-slot:model="{ source }">
                <Button
                    size="small"
                    style="width: 100%"
                    @click="clickItem(source)"
                    >{{ `# - ${source.id}` }}</Button
                >
            </template>
        </VirtualScroll>
    </div>
</template>

<script>
import { VirtualScroll } from "desigin-ui/index";
export default {
    data() {
        return {
            lists: [],
        };
    },
    components: {
        VirtualScroll,
    },
    created() {
        this.initwrap(200);
    },
    methods: {
        initwrap(rows) {
            const item = {};
            for (let v = 0; v < 10; v++) {
                item[`v${v}`] = `# ${v}`;
            }
            let i = 0;
            while (i < rows) {
                i++;
                item.id = i;
                // 浅拷贝啊 我去。。
                this.lists.push({
                    ...item,
                });
            }
        },
        clickItem(item){
            console.log(item);
        }
    },
};
</script>                         

<style lang="less">
.sh-virtual{
    overflow: auto;
}
</style>