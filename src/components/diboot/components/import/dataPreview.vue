<template>
  <div class="import-preview" v-if="visible">
    <a-divider/>
    <div v-if="totalCount>0">
      <div class="alert alert-info">
        Excel文件解析成功，共有 <strong>{{ totalCount }}</strong> 条数据可上传.
      </div>
      <a-table
        size="default"
        :columns="columns"
        :dataSource="dataList"
      >
      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataPreview',
  data () {
    return {
      visible: false,
      infos: {
        isPreview: true
      },
      columns: [],
      headers: [],
      dataList: []
    }
  },
  methods: {

    /**
     * 预览
     * @param headers  头部列表字段
     * @param dataList  数据
     */
    preview (headers, dataList, totalCount) {
      this.visible = true
      this.headers = headers
      this.dataList = dataList
      this.totalCount = totalCount || dataList.length
      const columns = []
      if (headers && headers.length > 0) {
        headers.forEach(header => {
          columns.push({ title: header.title, dataIndex: header.key })
        })
      }
      this.columns = columns
    },
    /**
     * 关闭预览
     */
    close () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
  .import-preview {
    margin-top: 10px;
  }
  .alert{
    border-radius: 3px;
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    color: #fff;
  }
  .alert-info{
    background-color: #00c0ef;
  }
</style>
