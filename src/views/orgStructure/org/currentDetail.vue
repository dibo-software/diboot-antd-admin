<template>
  <a-card
    :bordered="false"
    v-if="currentNodeId !== '0' && model"
    :bodyStyle="{paddingBottom: 0}">
    <a-descriptions bordered size="small">
      <a-descriptions-item label="简称">
        {{ model.shortName }}
      </a-descriptions-item>
      <a-descriptions-item label="全称">
        {{ model.name }}
      </a-descriptions-item>
      <a-descriptions-item label="编码">
        {{ model.code }}
      </a-descriptions-item>
      <a-descriptions-item label="上级部门">
        {{ parentName }}
      </a-descriptions-item>
      <a-descriptions-item label="类型">
        {{ model.typeLabel }}
      </a-descriptions-item>
      <a-descriptions-item label="负责人">
        {{ model.managerName || '-' }}
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script>
import { dibootApi } from '@/utils/request'

export default {
  name: 'OrgDetail',
  data () {
    return {
      baseApi: '/iam/org',
      model: undefined
    }
  },
  methods: {
    getDetail (id) {
      if (id === '0') {
        return
      }
      dibootApi.get(`${this.baseApi}/${id}`).then(res => {
        if (res.code === 0) {
          this.model = res.data
        } else {
          this.$message.error('获取当前部门详情失败')
        }
      })
    }
  },
  computed: {
    parentName: function () {
      if (this.model == null || !this.model.parentShortName) {
        return '-无-'
      }
      return this.model.parentShortName
    }
  },
  watch: {
    currentNodeId: function (val) {
      this.getDetail(val)
    }
  },
  props: {
    currentNodeId: {
      type: String,
      default: '0'
    }
  }
}
</script>

<style scoped>
</style>
