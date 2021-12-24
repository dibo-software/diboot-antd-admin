<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :labelCol="{span: 6}" :wrapperCol="{span: 18}" @submit.native="onSearch">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input
                @keyup.enter.native="onSearch"
                allowClear
                placeholder="姓名"
                v-model="queryParam.realname" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select
                @change="onSearch"
                allowClear
                placeholder="请选择"
                default-value=""
                v-model="queryParam.status">
                <a-select-option
                  v-for="(status, index) in more.userStatusOptions"
                  :key="index"
                  :value="status.value"
                >
                  {{ status.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button
                icon="search"
                type="primary"
                htmlType="submit">查询</a-button>
              <a-button
                icon="redo"
                @click="reset">重置</a-button>
            </span>
          </a-col>
          <a-col :lg="3" :sm="24" style="text-align: right;">
            <a-button
              v-action:create
              type="primary"
              icon="plus"
              @click="$refs.form.open(undefined)">新建</a-button>
          </a-col>
        </a-row>
      </a-form>
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
      <span slot="roleList" slot-scope="text, record">
        <template v-if="record.roleList">
          <a-tag v-for="(role, index) in record.roleList" :key="index">{{ role.name }}</a-tag>
        </template>
        <template v-else>
          <span>-</span>
        </template>
      </span>

      <span slot="action" slot-scope="text, record">
        <a v-action:detail href="javascript:;" @click="$refs.detail.open(record.id)">详情</a>
        <a-divider v-action:detail v-permission="['update', 'delete']" type="vertical" />
        <a-dropdown v-permission="['update', 'delete']">
          <a class="ant-dropdown-link">
            更多 <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-action:update>
              <a @click="$refs.form.open(record.id)">编辑</a>
            </a-menu-item>
            <a-menu-item v-action:delete>
              <a href="javascript:;" @click="remove(record.id)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <span v-permission-missing="['detail', 'update', 'delete']">
          -
        </span>
      </span>
    </a-table>

    <!--表单页抽屉-->
    <diboot-form
      ref="form"
      :current-node-id="currentNodeId"
      @complete="getList"
    ></diboot-form>
    <!--详情页抽屉-->
    <diboot-detail ref="detail">
    </diboot-detail>
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'

export default {
  name: 'IamUserList',
  data () {
    return {
      baseApi: '/iam/user',
      allowCanceledDelete: false,
      attachMoreList: [
        {
          target: 'USER_STATUS'
        }
      ],
      columns: [
        {
          title: '姓名',
          dataIndex: 'realname'
        },
        {
          title: '角色',
          dataIndex: 'roleNameList',
          scopedSlots: { customRender: 'roleList' }
        },
        {
          title: '电话',
          dataIndex: 'mobilePhone',
          customRender: (text) => text || '-'
        },
        {
          title: '状态',
          dataIndex: 'statusLabel'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
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
  components: {
    dibootForm,
    dibootDetail
  },
  mixins: [list],
  watch: {
    currentNodeId: function (val) {
      if (!val || val === '0' || val === 0) {
        this.customQueryParam = {}
      } else {
        this.customQueryParam = { orgId: val }
      }
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
