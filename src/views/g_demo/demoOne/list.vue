<template>
  <a-card :bordered="false">
    <sales-lead-multi-tab ref="salesLeadMultiTab" />

  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import salesLeadMultiTab from '@/views/panel/salesLeadMultiTab'

export default {
  name: 'DemoOneList',
  components: {
    salesLeadMultiTab
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/demoOne',
      getListFromMixin: true

    }
  }

}
</script>
<style lang="less" scoped>
</style>
