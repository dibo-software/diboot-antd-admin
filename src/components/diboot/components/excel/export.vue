<template>
  <span style="margin: 0 10px;">
    <a-dropdown-button @click="exportData">
      <a-icon :type="exportLoadingData ? 'loading' : 'cloud-download'"/> 导出
      <a-icon slot="icon" type="down"/>
      <a-menu slot="overlay" @click="handleCommand">
        <a-menu-item key="select"> 选择列导出 </a-menu-item>
        <a-menu-divider v-show="options.length > 0"/>
        <a-menu-item v-for="(item, index) in options" :key="index" @click="handleCommand(item.columns)">
          {{ item.title }}
        </a-menu-item>
      </a-menu>
    </a-dropdown-button>
    <a-modal v-model="visible" :confirm-loading="confirmLoading" :width="width">
      <span slot="title">
        选择导出列
        <a-checkbox
          style="margin-left: 25px;"
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
        >
          全选
        </a-checkbox>
      </span>
      <a-checkbox-group v-model="checkedList" @change="onChange" style="width: 100%;">
        <a-table
          bordered
          rowKey="uid"
          :loading="tableLoading"
          :columns="tableHead"
          :dataSource="dataList"
          :pagination="false"
          :transformCellText="transformCellText"
        />
      </a-checkbox-group>
      <template slot="footer">
        <a-button key="back" @click="visible = false">取消</a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="confirm">确定</a-button>
      </template>
    </a-modal>
  </span>
</template>

<script>
import { dibootApi } from '@/utils/request'

export default {
  name: 'Export',
  props: {
    exportUrl: {
      type: String,
      required: true
    },
    tableHeadUrl: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      required: true
    },
    /**
     * 示例：[{title:'导出用户联系方式',columns:['realname','userNum','mobilePhone']}]
     */
    options: {
      type: Array,
      default: () => []
    },
    width: {
      type: [String, Number],
      default: 520
    }
  },
  data () {
    return {
      exportLoadingData: false,
      visible: false,
      // 加载中
      confirmLoading: false,
      // 表
      tableLoading: false,
      tableHead: [],
      dataList: [{ uid: 1 }],
      // 选择
      checkAll: true,
      indeterminate: false,
      checkedList: [],
      plainOptions: []
    }
  },
  methods: {
    confirm () {
      this.handleCommand(this.checkedList)
      this.visible = false
    },
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
      this.checkAll = checkedList.length === this.plainOptions.length
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    transformCellText ({ column }) {
      const key = column.key
      if (!this.plainOptions.includes(key)) {
        this.checkedList.push(key)
        this.plainOptions.push(key)
      }
      return this.$createElement('a-checkbox', {
        props: {
          value: key
        },
        style: {
          width: '100%',
          height: '100%'
        }
      }, '')
    },
    exportData () {
      this.exportLoadingData = true
      this.__download(this.exportUrl)
    },
    handleCommand (columns) {
      if (columns instanceof Array) {
        this.__download(this.exportUrl, { ...this.params, columns })
      } else {
        this.visible = true
        if (this.tableHead.length === 0) {
          this.tableLoading = true
          dibootApi.get(this.tableHeadUrl)
            .then(res => {
              this.tableHead = res.data
              this.tableLoading = false
            })
            .catch(res => {
              this.$message.error(res.msg)
            })
        }
      }
    },
    __download (url, params = this.params) {
      dibootApi.download(url, params).then(res => {
        if (res.code && res.code === 4006) {
          this.$message.error(res.msg)
          return
        }
        const blob = new Blob([res.data])
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = res.filename
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, res.filename)
        }
        this.exportLoadingData = false
      }).catch(err => {
        console.log(err)
        this.exportLoadingData = false
      })
    }
  }
}
</script>

<style scoped>

</style>
