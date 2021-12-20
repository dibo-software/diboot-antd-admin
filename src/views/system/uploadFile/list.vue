<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
        <a-row :gutter="18">
          <a-col :md="8" :sm="24">
            <a-form-item label="文件名">
              <a-input
                v-model="queryParam.fileName"
                allowClear
                @keyup.enter.native="onSearch"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="创建人">
              <a-select
                v-model="queryParam.createBy"
                placeholder="上传者筛选"
                allow-clear
                show-search
                :show-arrow="false"
                :filter-option="false"
                @search="value => attachMoreFilter(value, 'iamUser')"
                @change="onSearch"
              >
                <a-spin v-if="attachMoreLoading" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="(item, index) in more.iamUserOptions || []"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="创建时间">
                <date-range
                  @change="onSearch"
                  v-model="dateRangeQuery.createtime"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
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

    <a-table
      ref="table"
      size="default"
      :scroll="{ x: 1500 }"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      :loading="loadingData"
      @change="handleTableChange"
      rowKey="uuid"
    >
      <span slot="action" slot-scope="text, record">
        <a v-action:detail href="javascript:;" @click="$refs.detail.open(record.uuid)">详情</a>
        <a-divider v-action:detail v-permission="['update']" type="vertical"/>
        <a v-action:update href="javascript:;" @click="$refs.form.open(record.uuid)">编辑</a>
      </span>
    </a-table>
    <diboot-form ref="form" @complete="getList"></diboot-form>
    <diboot-detail ref="detail"></diboot-detail>
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dateRange from '@/components/diboot/components/dateRange'
import dibootForm from './form'
import dibootDetail from './detail'

export default {
  name: 'UploadFileList',
  components: {
    dateRange,
    dibootForm,
    dibootDetail
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/uploadFile',
      columns: [
        {
          title: '关联对象类',
          dataIndex: 'relObjType'
        },
        {
          title: '文件名',
          width: '250px',
          ellipsis: true,
          dataIndex: 'fileName'
        },
        {
          title: '文件类型',
          dataIndex: 'fileType'
        },
        {
          title: '数据量',
          dataIndex: 'dataCount'
        },
        {
          title: '备注',
          width: '200px',
          ellipsis: true,
          dataIndex: 'description'
        },
        {
          title: '创建人',
          dataIndex: 'createByName'
        },
        {
          title: '创建时间',
          width: '180px',
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
      attachMoreLoader: {
        iamUser: {
          target: 'IamUser',
          label: 'realname',
          value: 'id'
        }
      }
    }
  }
}
</script>
