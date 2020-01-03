<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="state.visible"
    @close="close"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-form layout="vertical" :form="form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="上级部门">
            <a-select
              v-if="more.iamOrgKvList !== undefined"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择上级部门"
              v-decorator="[
                'parentId',
                {
                  initialValue: parentId
                }
              ]"
            >
              <a-select-option :value="'0'">-无-</a-select-option>
              <a-select-option
                v-for="(org, index) in more.iamOrgKvList"
                :key="index"
                :value="org.k"
              >
                {{ org.v }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="编码">
            <a-input
              placeholder="编码"
              v-decorator="[
                'code',
                {
                  initialValue: model.code,
                  rules: [
                    { required: true, message: '编码不能为空', whitespace: true },
                    { validator: this.checkCodeDuplicate }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="简称">
            <a-input
              placeholder="简称"
              v-decorator="[
                'shortName',
                {
                  initialValue: model.shortName,
                  rules: [{ required: true, message: '简称不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="全称">
            <a-input
              placeholder="全称"
              v-decorator="[
                'name',
                {
                  initialValue: model.name,
                  rules: [{ required: true, message: '全称不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="类型">
            <a-select
              v-if="more.orgTypeKvList !== undefined"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择类型"
              v-decorator="[
                'type',
                {
                  initialValue: model.type,
                  rules: [{ required: true, message: '类型不能为空', whitespace: true }]
                }
              ]"
            >
              <a-select-option
                v-for="(type, index) in more.orgTypeKvList"
                :key="index"
                :value="type.v"
              >
                {{ type.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div class="footer">
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.submitBtn" :disabled="state.submitBtn">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
// eslint-disable-next-line standard/object-curly-even-spacing
export default {
  name: 'OrgStructureDrawer',
  data () {
    return {
      name: 'iam/org',
      form: this.$form.createForm(this)
    }
  },
  mixins: [ form ],
  methods: {
    async checkCodeDuplicate (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.model.id, code: value }
      const res = await dibootApi.get(`/${this.name}/checkTypeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    }
  },
  computed: {
    parentId: function () {
      if (this.model === undefined || !this.model.parentId) {
        return this.currentNodeId.toString(10)
      }
      return this.model.parentId.toString(10)
    }
  },
  props: {
    more: {
      type: Object,
      default: () => {
        return {}
      }
    },
    currentNodeId: {
      type: Number,
      default: () => {
        return 0
      }
    }
  }
}
</script>

<style scoped>
  .footer{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right
  }
</style>
