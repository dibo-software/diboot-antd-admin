<template>
  <a-drawer
    title="权限拖拽排序"
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
            showIcon
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
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import treeSort from '@/components/diboot/mixins/treeSort'
import { permissionTreeListFormatter } from '@/utils/treeDataUtil'

export default {
  name: 'Dictionary',
  data () {
    return {
      baseApi: '/dictionary'
    }
  },
  methods: {
    // 对排序列表进行过滤处理
    treeListFilter (list) {
      return list.filter(item => {
        return !item.parentId || item.parentId === 0
      })
    },
    treeListFormatter (treeList, valueField, titleField) {
      return permissionTreeListFormatter(treeList, 'id', 'itemName')
    },
    levelChangeWarning () {
      this.$message.warning('不可更改字典层级关系！')
    }
  },
  mixins: [ treeSort ]
}
</script>

<style scoped>
</style>
