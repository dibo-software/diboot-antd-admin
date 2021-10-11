<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin :spinning="spinning">
      <a-descriptions :column="1">
        <a-descriptions-item label="类型名称">{{ model.itemName }}</a-descriptions-item>
        <a-descriptions-item label="类型编码">{{ model.type }}</a-descriptions-item>
        <a-descriptions-item label="包含子项">
          <template v-for="(item,i) in children">
            <a-tag color="blue" :key="i">{{ item.itemName }}({{ item.itemValue }})</a-tag>
          </template>
        </a-descriptions-item>
        <a-descriptions-item label="备注">{{ model.description || '-' }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>

    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
export default {
  name: 'DictionaryDetail',
  data () {
    return {
      baseApi: '/dictionary',
      children: []
    }
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
