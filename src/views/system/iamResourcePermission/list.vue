<template>
  <a-card :border="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit.native="onSearch">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="菜单名称">
              <a-input
                @keyup.enter.native="onSearch"
                allowClear
                placeholder="名称"
                v-model="queryParam.displayName" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="菜单编码">
              <a-input
                @keyup.enter.native="onSearch"
                allowClear
                placeholder="菜单编码"
                v-model="queryParam.resourceCode" />
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
          <a-col :md="9" :sm="24" style="text-align: right;">
            <a-button
              v-action:sort
              @click="$refs.sort.open()"
              icon="drag"
              type="default">排序</a-button>
            <a-button
              v-action:create
              type="primary"
              icon="plus"
              @click="create">新建</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-alert v-if="!loadingData && (!data || data.length === 0)" message="请点击右上角新建开始配置系统菜单与权限！" banner style="margin-bottom: 20px;" />
    <a-table
      v-if="data && data.length > 0"
      ref="table"
      size="default"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      :loading="loadingData"
      @change="handleTableChange"
      :defaultExpandAllRows="true"
      rowKey="id"
    >
      <span slot="permissionList" slot-scope="text, record">
        <template v-if="record.permissionList && record.permissionList.length > 0">
          <a-tag v-for="(permission, index) in record.permissionList" :key="index">
            {{ `${permission.displayName}[${permission.resourceCode}]` }}
          </a-tag>
        </template>
      </span>
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
            <a-menu-item v-action:create>
              <a @click="createSubMenu(record.id)">添加子菜单</a>
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

    <diboot-form ref="form" @complete="getList" :initParentId="formParentId"></diboot-form>
    <diboot-detail ref="detail"></diboot-detail>
    <permission-tree-sort ref="sort" @complete="getList"></permission-tree-sort>
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'
import permissionTreeSort from './treeSort'
import { clearNullChildren } from '@/utils/treeDataUtil'

export default {
  name: 'IamResourcePermissionList',
  components: {
    dibootForm,
    dibootDetail,
    permissionTreeSort
  },
  mixins: [ list ],
  data () {
    return {
      baseApi: '/iam/resourcePermission',
      customQueryParam: { displayType: 'MENU' },
      allowCanceledDelete: false,
      formParentId: '0',
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'displayName',
          width: 200
        },
        {
          title: '菜单编码',
          dataIndex: 'resourceCode',
          width: 160
        },
        {
          title: '页面按钮权限',
          dataIndex: 'permissionList',
          scopedSlots: { customRender: 'permissionList' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
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
    afterLoadList (data) {
      this.data = clearNullChildren(data)
    },
    create () {
      this.formParentId = '0'
      this.$refs.form.open(undefined)
    },
    createSubMenu (parentId) {
      this.formParentId = `${parentId}`
      this.$refs.form.open(undefined)
    }
  }
}
</script>

<style scoped>
</style>
