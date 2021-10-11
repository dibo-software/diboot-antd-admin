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
            <a-icon slot="menu" type="bars" />
            <a-icon slot="permission" type="thunderbolt" />
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
import { permissionTreeListFormatter } from '@/utils/treeDataUtil'

export default {
  name: 'IamResourcePermissionSort',
  data () {
    return {
      baseApi: '/iam/resourcePermission'
    }
  },
  methods: {
    treeListFormatter (treeList, valueField, titleField) {
      return permissionTreeListFormatter(treeList, 'id', 'displayName')
    }
  },
  mixins: [ treeSort ]
}
</script>

<style scoped>
</style>
