<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit.native="onSearch">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="用户类型">
              <a-input placeholder="IamUser" v-model="queryParam.userType" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="用户ID">
              <a-input placeholder="10001" v-model="queryParam.userId" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="业务对象">
              <a-input placeholder="" v-model="queryParam.businessObj" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="请求方式">
              <a-select placeholder="选择" default-value="" v-model="queryParam.requestMethod">
                <a-select-option
                  value="GET"
                >
                  GET
                </a-select-option>
                <a-select-option
                  value="POST"
                >
                  POST
                </a-select-option>
                <a-select-option
                  value="PUT"
                >
                  PUT
                </a-select-option>
                <a-select-option
                  value="DELETE"
                >
                  DELETE
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="选择" default-value="" v-model="queryParam.status">
                <a-select-option
                  value="0"
                >
                  成功
                </a-select-option>
                <a-select-option
                  value="1"
                >
                  失败
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button
                icon="search"
                type="primary"
                htmlType="submit">查询</a-button>
              <a-button
                icon="redo"
                style="margin-left: 8px"
                @click="reset">重置</a-button>
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
      <span slot="successLabel" slot-scope="text, record">
        <a-tag v-if="record.statusCode === 0" color="green">成功</a-tag>
        <a-tag v-else color="red">失败</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <div v-if="record.superAdmin === true">
          -
        </div>
        <div v-else>
          <a v-action:detail href="javascript:;" @click="$refs.detail.open(record.id)">详情</a>
          <span v-permission-missing="['detail']">
            -
          </span>
        </div>
      </span>
    </a-table>

    <diboot-detail ref="detail"></diboot-detail>
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootDetail from './detail'

export default {
  name: 'TableList',
  components: {
    dibootDetail
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/iam/operationLog',
      // 表头
      columns: [
        {
          title: '用户姓名',
          dataIndex: 'userRealname'
        },
        {
          title: '用户类型',
          dataIndex: 'userType'
        },
        {
          title: '用户ID',
          dataIndex: 'userId'
        },
        {
          title: '业务对象',
          dataIndex: 'businessObj'
        },
        {
          title: '操作事项',
          dataIndex: 'operation'
        },
        {
          title: '请求方式',
          dataIndex: 'requestMethod'
        },
        {
          title: '请求URI',
          dataIndex: 'requestUri'
        },
        {
          title: '状态码',
          dataIndex: 'statusCode',
          scopedSlots: { customRender: 'successLabel' }
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
</style>
