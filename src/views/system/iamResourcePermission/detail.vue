<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <detail-list :col="1">
        <detail-list-item term="上级菜单">{{ model.parentDisplayName ? model.parentDisplayName : '无' }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="菜单名称">{{ model.displayName }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="菜单编码">{{ model.resourceCode }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="页面按钮/权限">
          <template v-if="model.permissionList && model.permissionList.length > 0">
            <a-tag color="cyan" :key="i" v-for="(permission,i) in model.permissionList">
              {{ `${permission.displayName}[${permission.resourceCode}]` }}
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

    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  name: 'IamResourcePermissionDetail',
  data () {
    return {
      baseApi: '/iam/resourcePermission'
    }
  },
  components: {
    DetailList,
    DetailListItem
  },
  mixins: [ detail ]
}
</script>

<style scoped>
</style>
