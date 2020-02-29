<template>
  <a-drawer
    :title="title"
    :width="720"
    @close="close"
    :visible="visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
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
        </detail-list-item>
      </detail-list>
    </a-spin>

    <div class="footer">
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
