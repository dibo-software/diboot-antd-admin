<template>
  <div class="userList content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
        <a-row :gutter="18">
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input
                @keyup.enter.native="onSearch"
                allowClear
                v-model="queryParam.realname"
                placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="工号">
              <a-input
                @keyup.enter.native="onSearch"
                allowClear
                v-model="queryParam.userNum"
                placeholder=""/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="性别">
                <a-select
                  @change="onSearch"
                  v-model="queryParam.gender"
                  allowClear
                  placeholder="请选择">
                  <a-select-option
                    v-for="(gender, index) in more.genderOptions"
                    :key="index"
                    :value="gender.value"
                  >
                    {{ gender.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="电话">
                <a-input
                  @keyup.enter.native="onSearch"
                  v-model="queryParam.mobilePhone"
                  allowClear
                  placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="邮箱">
                <a-input
                  @keyup.enter.native="onSearch"
                  v-model="queryParam.email"
                  allowClear
                  placeholder=""/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="onSearch">查询</a-button>
              <a-button @click="reset">重置</a-button>
              <a @click="toggleAdvanced">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button v-action:create type="primary" icon="plus" @click="$refs.userForm.open()">添加用户</a-button>
      <a-button v-action:import type="default" icon="cloud-upload" @click="$refs.userImport.open()">批量导入</a-button>
      <a-button v-action:export type="default" icon="cloud-download" @click="exportData">导出</a-button>
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
      <span slot="realname" slot-scope="text, record">
        <span v-if="!(record.userPositionList || []).length || record.userPositionList.some(e => e.isPrimaryPosition)">
          {{ text }}
        </span>
        <a-tooltip v-else placement="top">
          <template #title>兼职</template>
          <a-badge dot>{{ text }}</a-badge>
        </a-tooltip>
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-action:detail @click="$refs.userDetail.open(record.id)">详情</a>
        <a-divider v-action:detail v-permission="['position', 'update', 'delete']" type="vertical" />
        <a v-action:position @click="$refs.userPositionRefForm.open(record)">岗位</a>
        <a-divider v-action:position v-permission="['update', 'delete']" type="vertical" />
        <a-dropdown v-permission="['update', 'delete']">
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-action:update>
              <a @click="$refs.userForm.open(record.id)">编辑</a>
            </a-menu-item>
            <a-menu-item v-action:delete>
              <a href="javascript:;" @click="remove(record.id)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>

    <user-position-ref-form ref="userPositionRefForm"></user-position-ref-form>
    <user-form ref="userForm" :current-node-id="currentNodeId" @complete="getList"></user-form>
    <user-detail ref="userDetail"></user-detail>
    <user-import ref="userImport" :current-node-id="currentNodeId" @complete="getList"></user-import>
  </div>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import userDetail from '@/views/orgStructure/orgUser/userDetail'
import userForm from '@/views/orgStructure/orgUser/userForm'
import userImport from '@/views/orgStructure/orgUser/userImport'
import userPositionRefForm from '@/views/orgStructure/orgUser/userPositionRefForm'

export default {
  name: 'UserList',
  components: {
    userDetail,
    userForm,
    userImport,
    userPositionRefForm
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/iam/user',
      exportApi: '/excel/export',
      attachMoreList: [
        {
          target: 'GENDER'
        }
      ],
      allowCanceledDelete: false,
      // 表头
      columns: [
        {
          title: '部门',
          dataIndex: 'orgShortName'
        },
        {
          title: '姓名',
          dataIndex: 'realname',
          scopedSlots: { customRender: 'realname' }
        },
        {
          title: '用户编号',
          dataIndex: 'userNum'
        },
        {
          title: '性别',
          dataIndex: 'genderLabel'
        },
        {
          title: '电话',
          dataIndex: 'mobilePhone'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
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
