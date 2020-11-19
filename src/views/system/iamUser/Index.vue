<template>
  <a-card :bordered="false">
    <a-row v-permission="['orgTree']">
      <a-col :span="6">
        <org-tree ref="orgTree" @changeCurrentNode="onChangeCurrentNode" />
      </a-col>
      <a-col :span="18">
        <user-list :current-node-id="currentNodeId" ref="userList" />
      </a-col>
    </a-row>
    <user-list v-permission-missing="['orgTree']" :current-node-id="currentNodeId" ref="userList" />
  </a-card>
</template>

<script>
import orgTree from '@/views/system/iamOrg/orgTree'
import userList from './list'

export default {
  name: 'OrgUserList',
  components: {
    orgTree,
    userList
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
    }
  }

}
</script>
<style lang="less" scoped>
</style>
