<template>
  <div>
    <a-tabs>
      <a-tab-pane key="0" tab="线索状态分类">
        <sales-lead-status-tab ref="salesLeadStatusTab" />
      </a-tab-pane>
      <a-tab-pane key="1" tab="来源渠道分类">
        <sales-lead-src-tab ref="salesLeadSrcTab" />

      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import salesLeadStatusTab from '@/views/panel/salesLeadStatusTab'
import salesLeadSrcTab from '@/views/panel/salesLeadSrcTab'

export default {
  name: 'SalesLeadMultiTab',
  components: {
    salesLeadStatusTab,
    salesLeadSrcTab
  }

}
</script>
<style lang="less" scoped>
</style>
