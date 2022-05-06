<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <a-descriptions :column="1">
        <a-descriptions-item label="上级菜单">{{ model.parentDisplayName ? model.parentDisplayName : '无' }}</a-descriptions-item>
        <a-descriptions-item label="菜单名称">{{ model.displayName }}</a-descriptions-item>
        <a-descriptions-item label="菜单编码">{{ model.resourceCode }}</a-descriptions-item>
        <a-descriptions-item label="菜单页权限码">
          <template v-if="model.permissionCodes && model.permissionCodes.length > 0">
            <template v-for="permissionCode in model.permissionCodes">
              <a-tag color="green" :key="`menu_permission_${permissionCode}`" >
                {{ permissionCode }}
              </a-tag>
            </template>
          </template>
          <template v-else>
            无
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="页面资源权限">
          <template v-if="!model.permissionList || model.permissionList.length === 0">
            无
          </template>
        </a-descriptions-item>
      </a-descriptions>
      <a-tabs :default-active-key="0" v-if="model.permissionList && model.permissionList.length > 0">
        <a-tab-pane
          v-for="(p, i) in model.permissionList"
          :key="i"
          :tab="p.displayName">
          <a-descriptions :column="1">
            <a-descriptions-item label="名称">{{ p.displayName }}</a-descriptions-item>
            <a-descriptions-item label="编码">{{ p.resourceCode }}</a-descriptions-item>
            <a-descriptions-item label="按钮权限码">
              <template v-if="p.permissionCodes && p.permissionCodes.length > 0">
                <template v-for="permissionCode in p.permissionCodes">
                  <a-tag color="green" :key="`permission_${permissionCode}`" >
                    {{ permissionCode }}
                  </a-tag>
                </template>
              </template>
              <template v-else>
                无
              </template>
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
      </a-tabs>
    </a-spin>

    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import { dibootApi } from '@/utils/request'
export default {
  name: 'IamResourcePermissionDetail',
  data () {
    return {
      baseApi: '/iam/resourcePermission',
      originApiList: []
    }
  },
  mixins: [ detail ],
  computed: {
    permissionCodeApiMap () {
      const map = {}
      this.originApiList.forEach(item => {
        const apiPermissionList = item.apiPermissionList
        if (apiPermissionList && apiPermissionList.length > 0) {
          apiPermissionList.forEach(apiPermission => {
            const permissionCode = apiPermission.code
            map[permissionCode] = apiPermission.apiUriList
          })
        }
      })
      return map
    }
  },
  methods: {
    afterOpen () {
      dibootApi.get(`${this.baseApi}/apiList`).then(res => {
        if (res.code === 0) {
          this.originApiList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
