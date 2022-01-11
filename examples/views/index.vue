<template>
    <div class="wrapper">

<!--        <RotationScroll-->
<!--            :list="list"-->
<!--            :itemWidth="100"-->
<!--            wrapperClass="aa"-->
<!--            scrollClass="bb"-->
<!--        >-->
<!--            <ul>-->
<!--                <li v-for="item in list" :key="item.id">-->
<!--                    {{ item }}-->
<!--                </li>-->
<!--            </ul>-->
<!--        </RotationScroll>-->
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
// import { RotationScroll } from "desigin-ui/index";
export default {
    data() {
        return {
            list: [],
            form: {
              name: '',
            },
            rules: {
              name: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
              ],
            }
        };
    },
    components: {
        // RotationScroll,
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
    ul {
        // display: flex;
        li {
            list-style: none;
            // width: 100px;
        }
    }
}
</style>