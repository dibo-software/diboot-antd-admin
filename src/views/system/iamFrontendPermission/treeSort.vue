<template>
  <a-drawer
    title="权限拖拽排序"
    width="720"
    :visible="visible"
    @close="close"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
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

    <div class="footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import treeSort from '@/components/diboot/mixins/treeSort'
import { permissionTreeListFormatter } from '@/utils/treeDataUtil'

export default {
  name: 'IamFrontendPermissionSort',
  data () {
    return {
      baseApi: '/iam/frontendPermission'
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
  .footer{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right
  }
</style>
