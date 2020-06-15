<template>
  <a-drawer
    :title="`角色${title}`"
    :width="width"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <detail-list :col="1">
        <detail-list-item term="角色名称">{{ model.name }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="角色编码">{{ model.code }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="角色描述">{{ model.description || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="已授权权限">
          <a-tree
            v-if="permissionTreeList.length > 0"
            showIcon
            checkStrictly
            :defaultExpandAll="true"
            :treeData="permissionTreeList"
          >
            <a-icon slot="menu" type="bars" />
            <a-icon slot="permission" type="thunderbolt" />
          </a-tree>
          <template v-else>
            无
          </template>
        </detail-list-item>
      </detail-list>
    </a-spin>

    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import DetailList from '@/components/tools/DetailList'
import { permissionTreeListFormatter } from '@/utils/treeDataUtil'

const DetailListItem = DetailList.Item
export default {
  name: 'IamRoleDetail',
  data () {
    return {
      baseApi: '/iam/role',
      permissionTreeList: []
    }
  },
  methods: {
    async afterOpen (id) {
      if (this.model && this.model.permissionVOList) {
        this.permissionTreeList = permissionTreeListFormatter(this.model.permissionVOList, 'id', 'displayName')
      }
    },
    afterClose () {
      this.permissionTreeList = []
    }
  },
  components: {
    DetailList,
    DetailListItem
  },
  mixins: [ detail ]
}
</script>

<style lang="less" scoped>
</style>
