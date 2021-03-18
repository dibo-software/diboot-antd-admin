<template>
  <a-drawer
    class="detail-wrapper"
    :title="title"
    :width="720"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-descriptions :column="1">
      <a-descriptions-item label="标题">
        {{ model.title }}
      </a-descriptions-item>
      <a-descriptions-item label="描述">
        {{ model.descrip }}
      </a-descriptions-item>
      <a-descriptions-item label="内容">
        <rich-render :content="model.content"></rich-render>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ model.createTime }}
      </a-descriptions-item>
    </a-descriptions>
    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import RichRender from '@/components/diboot/components/richText/RichRender'
export default {
  name: 'ArticleDetail',
  components: {
    RichRender
  },
  mixins: [detail],
  data () {
    return {
      baseApi: '/article'
    }
  },
  methods: {
    onAfterOpen () {
  // 事件处理代码
},
    afterOpen () {
			this.onAfterOpen()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
