<template>
  <div>
    <a-tabs v-if="dictItems.length > 0" v-model="currentTabsValue">
      <a-tab-pane
        v-for="item in dictItems"
        :key="item.v"
        :tab="item.k">
        <sales-lead-list ref="salesLeadList" v-if="item.v" :leadStatus="`${item.v}`" />

      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request'
import salesLeadList from '@/views/panel/salesLeadList'

export default {
  name: 'SalesLeadStatusTab',
  components: {
    salesLeadList

  },
  data () {
    return {
      currentTabsValue: '',
      dictItems: []
    }
  },
  methods: {
    async getDictItems () {
      const res = await dibootApi.get('/dictionary/items/LEAD_STATUS')
      if (res.code === 0) {
        this.dictItems = res.data
        if (this.dictItems.length > 0) {
          this.currentTabsValue = this.dictItems[0]['v']
        }
      } else {
        this.$message.error('获取数据失败')
      }
    }
  },
  created () {
    this.getDictItems()
  }

}
</script>
<style lang="less" scoped>
</style>
