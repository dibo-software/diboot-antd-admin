<template>
  <a-card :bordered="false">
    <a-row :gutter="32">
      <a-col :span="8">
        <org-tree ref="orgTree" :can-change="true" @changeCurrentNode="onChangeCurrentNode" />
      </a-col>
      <a-col :span="16">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="部门信息" key="1">
            <detail-info ref="detailInfo"></detail-info>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import orgTree from '@/views/system/iamOrg/orgTree'
import detailInfo from '@/views/system/iamOrg/detailInfo'

export default {
  name: 'OrgIndex',
  components: {
    orgTree,
    detailInfo
  },
  data () {
    return {
      currentNodeId: ''
    }
  },
  methods: {
    onChangeCurrentNode (value) {
      // 事件处理代码
      this.currentNodeId = value
      this.$refs.detailInfo.getInfo(value)
    }
  }

}
</script>
<style lang="less" scoped>
</style>
