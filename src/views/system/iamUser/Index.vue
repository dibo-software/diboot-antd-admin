<template>
  <a-card :bordered="false">
    <a-row v-permission="['orgTree']">
      <a-col :span="6">
        <org-tree @changeCurrentNode="node => this.currentNodeId = `${node.value ? node.value : '0'}`" ref="orgTree"></org-tree>
      </a-col>
      <a-col :span="18">
        <user-list :current-node-id="currentNodeId" ref="userList" />
      </a-col>
    </a-row>
    <user-list v-permission-missing="['orgTree']" :current-node-id="currentNodeId" ref="userList" />
  </a-card>
</template>

<script>
import orgTree from '@/views/orgStructure/org/orgTree'
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
  }

}
</script>
<style lang="less" scoped>
</style>
