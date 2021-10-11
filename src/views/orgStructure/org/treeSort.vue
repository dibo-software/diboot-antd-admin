<template>
  <a-drawer
    title="组织机构拖拽排序"
    width="720"
    :visible="visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <a-row>
        <a-col :span="24">
          <a-tree
            v-if="treeList.length > 0"
            checkStrictly
            draggable
            @drop="onDrop"
            :defaultExpandAll="true"
            :treeData="treeList"
          >
          </a-tree>
        </a-col>
      </a-row>
    </a-spin>

    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import treeSort from '@/components/diboot/mixins/treeSort'
export default {
  name: 'OrgTreeSort',
  data () {
    return {
      baseApi: '/iam/org',
      treeListApi: '/iam/org/tree',
      formatter: {
        value: 'id',
        title: 'shortName'
      }
    }
  },
  mixins: [ treeSort ]
}
</script>

<style scoped>
</style>
