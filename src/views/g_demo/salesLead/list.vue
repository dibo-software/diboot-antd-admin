<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="18">
          <a-col :md="8" :sm="24">
            <a-form-item label="标题" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-input v-model="queryParam.title" placeholder="" style="width: 100%;"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="客户" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-select
                v-if="more.customerKvList"
                :getPopupContainer="getPopupContainer"
                placeholder="请选择客户"
                v-model="queryParam.customerId"
                style="width: 100%;"
              >
                <a-select-option
                  v-for="(item, index) in more.customerKvList"
                  :key="index"
                  :value="item.v"
                >
                  {{ item.k }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="销售员" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-select
                  v-if="more.iamUserKvList"
                  :getPopupContainer="getPopupContainer"
                  placeholder="请选择销售员"
                  v-model="queryParam.salesId"
                  style="width: 100%;"
                >
                  <a-select-option
                    v-for="(item, index) in more.iamUserKvList"
                    :key="index"
                    :value="item.v"
                  >
                    {{ item.k }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="来源渠道" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-select v-model="queryParam.srcChannel" placeholder="请选择来源渠道" style="width: 100%;">
                  <a-select-option
                    v-for="kv in more.channelKvList"
                    :key="kv.v"
                    :value="kv.v"
                  >
                    {{ kv.k }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="联系人" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-select
                  v-if="more.contactPersonKvList"
                  :getPopupContainer="getPopupContainer"
                  placeholder="请选择联系人"
                  v-model="queryParam.contactPersonId"
                  style="width: 100%;"
                >
                  <a-select-option
                    v-for="(item, index) in more.contactPersonKvList"
                    :key="index"
                    :value="item.v"
                  >
                    {{ item.k }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="线索状态" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-select v-model="queryParam.leadStatus" placeholder="请选择线索状态" style="width: 100%;">
                  <a-select-option
                    v-for="kv in more.leadStatusKvList"
                    :key="kv.v"
                    :value="kv.v"
                  >
                    {{ kv.k }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="截止期限" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-date-picker
                  format="YYYY-MM-DD"
                  v-model="queryParam.deadline"
                  style="width: 100%;"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="创建时间" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-date-picker
                  format="YYYY-MM-DD"
                  v-model="queryParam.createTime"
                  style="width: 100%;"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="onSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button v-action:create type="primary" icon="plus" @click="$refs.form.open()">新建</a-button>
      <a-button v-action:delete type="danger" icon="delete" @click="batchRemove">批量删除</a-button>
      <a-button v-action:import type="default" icon="cloud-upload" @click="$refs.import.open()">导入</a-button>
      <a-button v-action:export type="default" icon="cloud-download" @click="exportData">导出</a-button>
      <a-button type="default" icon="select" @click="onButtonClick">认领线索</a-button>
    </div>

    <a-table
      ref="table"
      size="default"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      :scroll="{ x: 'calc(700px + 50%)', y: 240 }"
      :loading="loadingData"
      :rowSelection="rowSelection"
      @change="handleTableChange"
      rowKey="id"
    >
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
      </span>
    </a-table>
    <diboot-form ref="form" @complete="getList"></diboot-form>
    <diboot-detail ref="detail"></diboot-detail>
    <diboot-import ref="import" @complete="getList"></diboot-import>
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'
import dibootImport from './excelImport'

export default {
  name: 'SalesLeadList',
  components: {
    dibootForm,
    dibootDetail,
    dibootImport
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/salesLead',
      getListFromMixin: true,
      attachMoreList: [
        {
          type: 'T',
          target: 'customer',
          key: 'short_name',
          value: 'id'
        },
        {
          type: 'T',
          target: 'iam_user',
          key: 'realname',
          value: 'id'
        },
        {
          type: 'D',
          target: 'CHANNEL'
        },
        {
          type: 'T',
          target: 'contact_person',
          key: 'realname',
          value: 'id'
        },
        {
          type: 'D',
          target: 'LEAD_STATUS'
        }
      ],
      columns: [
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '来源渠道',
          dataIndex: 'srcChannelLabel'
        },
        {
          title: '信息链接',
          dataIndex: 'channelLink'
        },
        {
          title: '线索状态',
          dataIndex: 'leadStatusLabel'
        },
        {
          title: '客户',
          dataIndex: 'customerName'
        },
        {
          title: '联系人',
          dataIndex: 'contactName'
        },
        {
          title: '截止期限',
          dataIndex: 'deadline'
        },
        {
          title: '销售员',
          dataIndex: 'salesName'
        },
        {
          title: '提醒信息',
          dataIndex: 'reminder'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: '150px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: []
    }
  },
  methods: {
    onButtonClick () {
      this.$message.error('无权执行该操作')
    },

    onRowSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  },
  computed: {
    /**
     * 控制是否显示行的checkbox
     * @returns {*}
     */
    rowSelection () {
      return { selectedRowKeys: this.selectedRowKeys, onChange: this.onRowSelectChange }
    }
  }

}
</script>
<style lang="less" scoped>
</style>
