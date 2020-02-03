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
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" htmlType="submit">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-col>
          <a-col :md="1" :sm="0"></a-col>
          <a-col :md="1" :sm="24">
            <a-button style="margin-right: 8px" type="primary" icon="plus" @click="$refs.form.open(undefined)">新建</a-button>
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
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="16"
          :style="{ marginBottom: '12px' }">
          <template v-if="record.menuList && record.menuList.length > 0">
            <a-col v-if="record.admin === true ">
              <a-tag color="blue">拥有所有权限</a-tag>
            </a-col>
            <a-col v-else :span="24" v-for="(role, index) in record.menuList" :key="index" class="roleItem">
              <a-col :span="3">
                <span>{{ role.menuName }}：</span>
              </a-col>
              <a-col :span="18" v-if="role.permissionList.length > 0">
                <a-tag color="cyan" v-for="(action, k) in role.permissionList" :key="k">
                  {{ action.permissionName }}
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
        </a-row>
      </div>

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <div v-if="record.admin === true">
          -
        </div>
        <div v-else>
          <a @click="$refs.form.open(record.id)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="remove(record.id)">删除</a>
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

export default {
  name: 'TableList',
  components: {
    dibootForm
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/iam/role',
      getMore: true,
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
