<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <detail-list :col="2">
        <detail-list-item term="上级部门">{{ parentName }}</detail-list-item>
        <detail-list-item term="编码">{{ model.code }}</detail-list-item>
      </detail-list>
      <detail-list :col="2">
        <detail-list-item term="简称">{{ model.shortName }}</detail-list-item>
        <detail-list-item term="全称">{{ model.name }}</detail-list-item>
      </detail-list>
      <detail-list :col="2">
        <detail-list-item term="类型">{{ model.typeLabel }}</detail-list-item>
        <detail-list-item term="负责人">{{ model.managerName || '-' }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="备注">{{ model.orgComment ? model.orgComment : '-' }}</detail-list-item>
      </detail-list>
    </a-spin>

    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import DetailList from '@/components/tools/DetailList'

const DetailListItem = DetailList.Item
export default {
  name: 'OrgDetail',
  data () {
    return {
      baseApi: '/iam/org'
    }
  },
  components: {
    DetailList,
    DetailListItem
  },
  mixins: [ detail ],
  methods: {
  },
  computed: {
    parentName: function () {
      if (this.model === undefined || !this.model.parentShortName) {
        return '-无-'
      }
      return this.model.parentShortName
    }
  }
}
</script>

<style scoped>
</style>
