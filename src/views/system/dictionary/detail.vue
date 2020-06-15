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
        <detail-list-item term="类型名称">{{ model.itemName }}</detail-list-item>
        <detail-list-item term="类型编码">{{ model.type }}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="包含子项">
          <template v-for="(item,i) in children">
            <a-tag color="blue" :key="i">{{ item.itemName }}({{ item.itemValue }})</a-tag>
          </template>
        </detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="备注">{{ model.description || '-' }}</detail-list-item>
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
  name: 'DictionaryDetail',
  data () {
    return {
      baseApi: '/dictionary',
      children: []
    }
  },
  components: {
    DetailList,
    DetailListItem
  },
  mixins: [ detail ],
  methods: {
    async afterOpen (id) {
      this.initSubItem(this.model)
    },
    initSubItem: function (data) {
      if (data.children && data.children.length > 0) {
        var children = []
        data.children.forEach(child => {
          children.push({ id: child.id, itemName: child.itemName, itemValue: child.itemValue })
        })
        this.children = children
      } else {
        this.children = []
      }
    },
    afterClose () {
      this.children = []
    }
  }
}
</script>

<style scoped>
</style>
