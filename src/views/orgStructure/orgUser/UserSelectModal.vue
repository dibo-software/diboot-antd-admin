<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirmLoading="confirmLoading"
    centered
    style="top: 0"
    :width="1200"
    @ok="close"
    @cancel="close"
  >
    <div class="OrgUserSelect">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-card :bordered="false">
            <readonly-org-tree @changeCurrentNode="node => currentNodeId = `${node.value ? node.value : '0'}`" ref="userSelectOrgTree"/>
          </a-card>
        </a-col>
        <a-col :span="16">
          <a-card :bordered="false">
            <a-tabs defaultActiveKey="1">
              <a-tab-pane :tab="tabTitle" key="1">
                <user-select-list :current-node-id="currentNodeId" ref="userSelectList" @select="record => selectUser(record)"/>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>
<script>
import userSelectOrgTree from '@/views/orgStructure/org/orgTree'
import userSelectList from '@/views/orgStructure/orgUser/userSelectList'
import ReadonlyOrgTree from '@/views/orgStructure/org/readonlyOrgTree'

export default {
  name: 'UserSelectModal',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      currentNodeId: '0'
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    selectUser (record) {
      this.$emit('select', record)
      this.close()
    },
    close () {
      this.visible = false
    }
  },
  computed: {
    tabTitle: function () {
      if (!this.currentNodeId || this.currentNodeId === '0' || this.currentNodeId === 0) {
        return '所有人员列表'
      } else {
        return '当前部门人员列表'
      }
    }
  },
  components: {
    ReadonlyOrgTree,
    userSelectOrgTree,
    userSelectList
  },
  props: {
    title: {
      type: String,
      default: '人员选择'
    }
  }
}
</script>
