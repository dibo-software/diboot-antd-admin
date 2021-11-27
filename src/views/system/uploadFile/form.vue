<template>
  <a-drawer
    :title="title"
    :width="720"
    @close="close"
    :visible="state.visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form layout="vertical" :form="form">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="备注">
            <a-textarea
              placeholder="请输入备注"
              v-decorator="[
                'description',
                {
                  initialValue: model.description
                }
              ]"
              :auto-size="{ minRows: 2 }"
              :max-length="100"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'

export default {
  name: 'UploadFileForm',
  mixins: [form],
  data () {
    return {
      baseApi: '/uploadFile',
      form: this.$form.createForm(this),
      primaryKey: 'uuid'
    }
  },
  methods: {
    async enhance (values) {
      for (const key of Object.keys(values)) {
        if (key !== 'description' && key !== this.primaryKey) {
          delete values[key]
        }
      }
    }
  }
}
</script>
