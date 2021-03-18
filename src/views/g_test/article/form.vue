<template>
  <a-drawer
    :title="title"
    :width="720"
    @close="close"
    :visible="state.visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-spin v-if="state.visible" :spinning="state.formDataLoading" tip="加载中...">
      <a-form layout="vertical" :form="form">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="标题">
              <a-input
                placeholder="请输入标题"
                v-decorator="[
                  'title',
                  {
                    initialValue: model.title,
                    rules: [{ required: true, message: '标题不能为空', whitespace: true }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="描述">
              <a-textarea
                placeholder="请输入描述"
                v-decorator="[
                  'descrip',
                  {
                    initialValue: model.descrip
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="内容">
              <!--key主要为了强制刷新富文本子组件，否则在打开更新的时候不会更新字段值-->
              <rich-editor
                rel-obj-type="Article"
                :rel-obj-id="model.id"
                placeholder="请输入内容"
                v-decorator="[
                  'content',
                  {
                    initialValue: model.content
                  }
                ]"
              ></rich-editor>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit || state.formDataLoading">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import RichEditor from '@/components/diboot/components/richText/RichEditor'
export default {
  name: 'ArticleForm',
  components: {
    RichEditor
  },
  mixins: [form],
  data () {
    return {
      baseApi: '/article',
      form: this.$form.createForm(this)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
