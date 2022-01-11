<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <a-descriptions :column="2">
        <a-descriptions-item label="上级部门">{{ parentName }}</a-descriptions-item>
        <a-descriptions-item label="编码">{{ model.code }}</a-descriptions-item>
        <a-descriptions-item label="简称">{{ model.shortName }}</a-descriptions-item>
        <a-descriptions-item label="全称">{{ model.name }}</a-descriptions-item>
        <a-descriptions-item label="类型">{{ model.typeLabel }}</a-descriptions-item>
        <a-descriptions-item label="负责人">{{ model.managerName || '-' }}</a-descriptions-item>
        <a-descriptions-item label="备注">{{ model.orgComment ? model.orgComment : '-' }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>

    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
export default {
  name: 'OrgDetail',
  data () {
    return {
      baseApi: '/iam/org'
    }
  },
  mixins: [ detail ],
  methods: {
  },
  computed: {
    parentName: function () {
      if (this.model == null || !this.model.parentShortName) {
        return '-无-'
      }
      return this.model.parentShortName
    }
  }
}
</script>

<style scoped>
</style>
