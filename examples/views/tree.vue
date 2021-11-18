<template>
  <div class="container">
    <customerTree
        :accordion="true"
        :defaultCheckedKeys="[]"
        :show-checkbox="false"
        :default-expand-all="false"
        :treeData="treeData"
        :showCheckbox="true"
        :lazy="true"
        :getLoadData="getLoadData"
    />
  </div>
</template>

<script>
// import customerTree from "@/components/customerTree/tree";
 export default {
   data(){
     return{
      treeData:[
        {
          name: '一级 2',
          id: 11,
          children: [
            // {
            //   name: '二级 2-1',
            //   id: 12,
            //   children: []
            // },
            // {
            //   name: '二级 2-2',
            //   id: 13,
            //   children: [
            //     {
            //       name: '三级 3-1',
            //       id: 15,
            //       children: [
            //         {
            //           name: '4级 4-1',
            //           id: 16,
            //         }
            //       ]
            //     }
            //   ]
            // },

          ]
        },
        // {
        //   name: '二级 2',
        //   id: 33,
        //   children:[
        //     {
        //       name: '二级 2-2-1',
        //       id: 10,
        //     }
        //   ]
        // }

      ]
     }
   },
  //  components:{
  //    customerTree
  //  },
   methods:{
     getLoadData(resolve){
       setTimeout(() => {
         resolve([{ name: 'region1',id: Math.random() }])
       },1000)
     }
   }

 }
</script>

<style lang="less">
.customer-tree{
  color: #606266;
  user-select: none;
  .tree-item{
    .item-content-wrap{
      padding: 8px 10px;
      .tree-node__expand-icon{
        transform: rotate(90deg);
      }
    }
    .current-node{
      background-color: #f5f7fa;
    }

    .item-content-wrap{
      display: flex;
      i{
        color: #c0c4cc;
      }
      &:hover{
        background-color: #f5f7fa;
      }
      .checkbox-wrapper{
        margin: 0px 6px;
      }
    }
  }
}

.tree-wrap{
  margin-left: 30px;
}
.collapse-transition{
  transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out;
}
.el-tree-node__loading-icon{
  margin: 0px 4px;
}
</style>
