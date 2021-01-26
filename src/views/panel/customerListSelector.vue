<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="18">
          <a-col :md="8" :sm="24">
            <a-form-item label="公司名" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-input v-model="queryParam.name" placeholder="" style="width: 100%;"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="简称" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-input v-model="queryParam.shortName" placeholder="" style="width: 100%;"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="税号" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-input v-model="queryParam.taxid" placeholder="" style="width: 100%;"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="电话" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-input v-model="queryParam.telphone" placeholder="" style="width: 100%;"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="地址" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-input v-model="queryParam.address" placeholder="" style="width: 100%;"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="客户状态" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-select v-model="queryParam.cusStatus" placeholder="请选择客户状态" style="width: 100%;">
                  <a-select-option
                    v-for="kv in more.cusStatusKvList"
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
  name: 'CustomerListSelector',
  mixins: [list],
  data () {
    return {
      baseApi: '/customer',
      selectedRowKeys: [],
      canSelect: true,
      listColumns: [
        {
          title: '简称',
          dataIndex: 'shortName'
        },
        {
          title: '税号',
          dataIndex: 'taxid'
        },
        {
          title: '电话',
          dataIndex: 'telphone'
        },
        {
          title: '地址',
          dataIndex: 'address'
        },
        {
          title: '客户状态',
          dataIndex: 'cusStatusLabel'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        }
      ],
      attachMoreList: [
        {
          type: 'D',
          target: 'CUS_STATUS'
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
  }

}
</script>
<style lang="less" scoped>
</style>
