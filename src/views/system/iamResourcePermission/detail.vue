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
        <a-descriptions-item label="页面接口列表">
          <template v-if="model.apiSetList && model.apiSetList.length > 0">
            <a-tag color="green" :key="i" v-for="(api,i) in model.apiSetList">
              {{ api }}
            </a-tag>
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
            <a-descriptions-item label="接口列表">
              <template v-if="p.apiSetList && p.apiSetList.length > 0">
                <a-tag color="green" :key="j" v-for="(api,j) in p.apiSetList">
                  {{ api }}
                </a-tag>
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
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
export default {
  name: 'IamResourcePermissionDetail',
  data () {
    return {
      baseApi: '/iam/resourcePermission'
    }
  },
  mixins: [ detail ]
}
</script>

<style scoped>
</style>
