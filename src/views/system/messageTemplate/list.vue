<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
        <a-row :gutter="18">
          <a-col :md="8" :sm="24">
            <a-form-item label="模版编码">
              <a-input
                @keyup.enter.native="onSearch"
                v-model="queryParam.code"
                allowClear
                placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="模版标题">
              <a-input
                @keyup.enter.native="onSearch"
                v-model="queryParam.title"
                allowClear
                placeholder=""/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="创建人">
                <a-select
                  v-model="queryParam.createBy"
                  placeholder=""
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
      <a-button v-action:create type="primary" icon="plus" @click="$refs.form.open()">新建</a-button>
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
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'

export default {
  name: 'MessageTemplateList',
  components: {
    dibootForm,
    dibootDetail
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/messageTemplate',
      columns: [
        {
          title: '模版编码',
          dataIndex: 'code'
        },
        {
          title: '模版标题',
          dataIndex: 'title'
        },
        {
          title: '创建人',
          dataIndex: 'createByName'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          width: '150px',
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
<style lang="less" scoped>
</style>
