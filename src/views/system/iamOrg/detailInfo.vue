<template>
  <div>
    <a-descriptions v-if="model.id" :column="1">
      <a-descriptions-item label="上级部门">
        {{ model.parentName ? model.parentName : '无' }}
      </a-descriptions-item>
      <a-descriptions-item label="名称">
        {{ model.name }}
      </a-descriptions-item>
      <a-descriptions-item label="简称">
        {{ model.shortName }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ model.orgComment ? model.orgComment : '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ model.createTime }}
      </a-descriptions-item>
    </a-descriptions>
    <a-empty v-else description="请选择部门" />
  </div>
</template>
<script>
import { dibootApi } from '@/utils/request'

export default {
  name: 'OrgDetailInfo',
  data () {
    return {
      model: {}
    }
  },
  methods: {
    async getInfo (id) {
      if (id === undefined || id === 0 || id === '0') {
        this.model = {}
      } else {
        const res = await dibootApi.get(`/iam/org/${id}`)
        if (res.code === 0) {
          this.model = res.data
        }
      }
    }
  }
}
</script>
