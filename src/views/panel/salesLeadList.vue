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
    <a-table
      ref="table"
      :row-selection="rowSelection"
      size="default"
      :columns="listColumns"
      :dataSource="data"
      :pagination="pagination"
      :loading="loadingData"
      @change="handleTableChange"
      rowKey="id"
    ></a-table>
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'

export default {
  name: 'SalesLeadList',
  mixins: [list],
  data () {
    return {
      baseApi: '/salesLead',
      selectedRowKeys: [],
      canSelect: false,
      listColumns: [
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
          title: '创建时间',
          dataIndex: 'createTime'
        }
      ],
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
      ]
    }
  },
  methods: {
    onTableSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.$emit('selectedRowKeys', selectedRowKeys)
      // 获取选取的数据对象列表
      let selectedRows = []
      if (this.data.length > 0 && selectedRowKeys.length > 0) {
        selectedRows = this.data.filter(row => {
          return selectedRowKeys.includes(row.id)
        })
      }
      this.$emit('selectedRows', selectedRows)
    }
  },
  computed: {
    /**
     * 控制是否显示行的checkbox
     * @returns {*}
     */
    rowSelection () {
      return this.canSelect
        ? { selectedRowKeys: this.selectedRowKeys, onChange: this.onTableSelectChange } : null
    }
  },
  watch: {
    leadStatus: {
      handler: function (val) {
        // 数据更改处理流程
        if (val) {
          this.customQueryParam.leadStatus = val
          this.getList()
        }
      },
      immediate: true
    },
    srcChannel: {
      handler: function (val) {
        if (val) {
          this.customQueryParam.srcChannel = val
          this.getList()
        }
      },
      immediate: true
    }
  },
  props: {
    leadStatus: {
      type: String
    },
    srcChannel: {
      type: String
    }
  }

}
</script>
<style lang="less" scoped>
</style>
