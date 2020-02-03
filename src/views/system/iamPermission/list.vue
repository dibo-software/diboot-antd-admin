<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit.native="getList">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="编码">
              <a-input placeholder="请输入" v-model="queryParam.menuCode" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="权限名称">
              <a-input placeholder="请输入" v-model="queryParam.menuName" />
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
      <span slot="actions" slot-scope="text, record">
        <a-tag color="cyan" v-for="(permission, index) in record.permissionList" :key="index">{{ permission.permissionName }}</a-tag>
      </span>

      <span slot="action">
        -
      </span>
    </a-table>

  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'

export default {
  name: 'TableList',
  mixins: [list],
  data () {
    return {
      baseApi: '/iam/permission',
      getMore: false,
      // 表头
      columns: [
        {
          title: '编码',
          dataIndex: 'menuCode'
        },
        {
          title: '权限名称',
          dataIndex: 'menuName'
        },
        {
          title: '可操作权限',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  }
}
</script>
