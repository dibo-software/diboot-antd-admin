<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="visible"
    @close="close"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-spin :spinning="spinning">
      <detail-list :col="1">
        <detail-list-item term="上级菜单">{{ model.parentDisplayName ? model.parentDisplayName : '无' }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="菜单名称">{{ model.displayName }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="菜单编码">{{ model.frontendCode }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="页面按钮/权限">
          <template v-if="model.permissionList && model.permissionList.length > 0">
            <a-tag color="cyan" :key="i" v-for="(permission,i) in model.permissionList">
              {{ `${permission.displayName}[${permission.frontendCode}]` }}
            </a-tag>
          </template>
          <template v-else>
            无
          </template>
        </detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="接口列表">
          <template v-if="model.apiSetList && model.apiSetList.length > 0">
            <a-tag color="green" :key="i" v-for="(api,i) in model.apiSetList">
              {{ api }}
            </a-tag>
          </template>
          <template v-else>
            无
          </template>
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
const DetailListItem = DetailList.Item
export default {
  name: 'IamFrontendPermissionDetail',
  data () {
    return {
      baseApi: '/iam/frontendPermission',
      children: []
    }
  },
  components: {
    DetailList,
    DetailListItem
  },
  mixins: [ detail ],
  methods: {
    async afterOpen (id) {
      this.initSubItem(this.model)
    },
    initSubItem: function (data) {
      if (data.children && data.children.length > 0) {
        var children = []
        data.children.forEach(child => {
          children.push({ id: child.id, itemName: child.itemName, itemValue: child.itemValue })
        })
        this.children = children
      } else {
        this.children = []
      }
    },
    close () {
      this.visible = false
      this.model = {}
      this.children = []
    }
  }
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
