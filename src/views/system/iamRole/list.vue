<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit.native="getList">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
              <a-input placeholder="请输入角色名称" v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="编码">
              <a-input placeholder="请输入编码" v-model="queryParam.code" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" htmlType="submit">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-action:create style="margin-right: 8px" type="primary" icon="plus" @click="$refs.form.open(undefined)">新建</a-button>
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
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="16"
          :style="{ marginBottom: '12px' }">
          <a-col v-if="record.superAdmin === true">
            <a-tag color="blue">拥有所有权限</a-tag>
          </a-col>
          <template v-else>
            <template v-if="record.permissionList && record.permissionList.length > 0">
              <a-col :span="24" v-for="(per, index) in record.permissions" :key="index" class="roleItem">
                <a-col :span="3">
                  <span>{{ per.name }}：</span>
                </a-col>
                <a-col :span="18" v-if="per.children && per.children.length > 0">
                  <a-tag color="cyan" v-for="(p, k) in per.children" :key="k">
                    {{ p.operationName }}
                  </a-tag>
                </a-col>
                <a-col :span="18" v-else>-</a-col>
              </a-col>
            </template>
            <template v-else>
              <a-col :span="12">
                <a-tag color="red">暂无相关权限</a-tag>
              </a-col>
            </template>
          </template>
        </a-row>
      </div>

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <div v-if="record.superAdmin === true">
          -
        </div>
        <div v-else>
          <a v-action:update @click="$refs.form.open(record.id)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown v-action:delete>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </span>
    </a-table>

    <diboot-form ref="form" :more="more" @refreshList="getList"></diboot-form>

  </a-card>
</template>

<script>
import dibootForm from './form'
import list from '@/components/diboot/mixins/list'
import forEach from 'lodash.foreach'

export default {
  name: 'TableList',
  components: {
    dibootForm
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/iam/role',
      getMore: false,
      // 表头
      columns: [
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '编码',
          dataIndex: 'code'
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
    afterLoadList (list) {
      list.forEach(role => {
        if (role.permissionList && role.permissionList.length > 0) {
          const childrenListMap = {}
          role.permissionList.forEach(per => {
            if (per.parentId !== 0) {
              if (childrenListMap[per.parentId] === undefined) {
                childrenListMap[per.parentId] = []
              }
              childrenListMap[per.parentId].push(per)
            }
          })
          // 合并childrenListMap为permissions
          const permissions = []
          forEach(childrenListMap, (values, key) => {
            if (values && values.length > 0) {
              const per = { name: values[0]['name'] }
              per.children = values
              permissions.push(per)
            }
          })
          role.permissions = permissions
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .roleItem {
    margin-bottom: 10px;
  }

  .roleItem:last-child {
    margin: auto;
  }
  .table-operator {
    margin-bottom: 18px;
  }
</style>
