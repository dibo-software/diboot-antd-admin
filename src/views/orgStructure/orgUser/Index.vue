<template>
  <div class="OrgUserIndex">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card :bordered="false">
          <org-tree @changeCurrentNode="node => currentNodeId = `${node.value ? node.value : '0'}`" ref="orgTree"></org-tree>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card :bordered="false">
          <a-tabs defaultActiveKey="1">
            <a-tab-pane :tab="tabTitle" key="1">
              <user-list :current-node-id="currentNodeId" ref="userList"></user-list>
            </a-tab-pane>
            <!--            <a-button slot="tabBarExtraContent" icon="plus" type="primary" @click="$refs.userForm.open()">添加用户</a-button>-->
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
    <user-form ref="userForm" :current-node-id="currentNodeId" @complete="$refs.userList.getList()"></user-form>
  </div>
</template>

<script>
import orgTree from '@/views/orgStructure/org/orgTree'
import userList from '@/views/orgStructure/orgUser/userList'
import userForm from '@/views/orgStructure/orgUser/userForm'
export default {
  name: 'OrgUserIndex',
  data () {
    return {
      currentNodeId: '0'
    }
  },
  computed: {
    tabTitle: function () {
      if (!this.currentNodeId || this.currentNodeId === '0' || this.currentNodeId === 0) {
        return '所有人员列表'
      } else {
        return '部门人员列表'
      }
    }
  },
  components: {
    orgTree,
    userList,
    userForm
  }
}
</script>

<style scoped>

</style>
