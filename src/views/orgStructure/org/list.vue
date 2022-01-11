<template>
  <div class="orgList">
    <div v-action:create class="table-operator" style="text-align: right;">
      <a-button v-action:create type="default" icon="plus" @click="$refs.form.open(undefined)">新建部门</a-button>
    </div>
    <a-table
      ref="table"
      size="default"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      :loading="loadingData"
      @change="handleTableChange"
      rowKey="id"
    >
      <span slot="action" slot-scope="text, record">
        <a v-action:detail href="javascript:;" @click="$refs.detail.open(record.id)">详情</a>
        <a-divider v-action:detail v-permission="['update', 'delete']" type="vertical" />
        <a-dropdown
          v-permission="['update', 'delete']">
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-action:update>
              <a @click="$refs.form.open(record.id)">编辑</a>
            </a-menu-item>
            <a-menu-item v-action:delete>
              <a href="javascript:;" @click="removeItem(record.id)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>

    <diboot-form ref="form" :current-node-id="currentNodeId" @complete="formComplete"></diboot-form>
    <diboot-detail ref="detail"></diboot-detail>
  </div>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'

export default {
  name: 'OrgList',
  components: {
    dibootForm,
    dibootDetail
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/iam/org',
      customQueryParam: { parentId: '0' },
      // 表头
      columns: [
        {
          title: '全称',
          dataIndex: 'name'
        },
        {
          title: '简称',
          dataIndex: 'shortName'
        },
        {
          title: '编码',
          dataIndex: 'code'
        },
        {
          title: '类型',
          dataIndex: 'typeLabel'
        },
        {
          title: '负责人',
          dataIndex: 'managerName'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    afterLoadList () {
      // 通知上层组件列表已更新
      if (this.data && this.data.length > 0) {
        this.data.forEach(item => {
          if (item.children != null) {
            delete item.children
          }
        })
      }
    },
    removeItem (id) {
      this.remove(id).then(() => {
        this.$emit('formComplete')
      })
    },
    formComplete () {
      this.getList()
      this.$emit('formComplete')
    }
  },
  watch: {
    currentNodeId: function (val) {
      this.customQueryParam = { parentId: val }
      this.getList()
    }
  },
  props: {
    currentNodeId: {
      type: String,
      default: '0'
    }
  }
}
</script>
<style lang="less" scoped>
</style>
