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
          <a-form-item label="父级">
            <a-select
              v-if="more.iamOrgKvList"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择父级"
              v-decorator="[
                'parentId',
                {
                  initialValue: model.parentId
                }
              ]"
            >
              <a-select-option
                v-for="(iamOrg, index) in more.iamOrgKvList"
                :key="index"
                :value="iamOrg.v"
              >
                {{ iamOrg.k }}
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
                  rules: [{ required: true, message: '编码不能为空', whitespace: true }]
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
import _ from 'lodash'
// 定义默认值
const CHILDREN_BTN_CONFIG_DEFAULT = {
  editing: false,
  type: 'primary',
  label: '添加子项',
  currentIndex: undefined
}
// eslint-disable-next-line standard/object-curly-even-spacing
const CHILDREN_ITEM_DEFAULT = { id: '', itemName: '', itemValue: '' }
export default {
  name: 'DictionaryDrawer',
  data () {
    return {
      name: 'dictionary',
      form: this.$form.createForm(this),
      children: [],
      childItem: _.cloneDeep(CHILDREN_ITEM_DEFAULT),
      childrenBtnConfig: _.cloneDeep(CHILDREN_BTN_CONFIG_DEFAULT)
    }
  },
  mixins: [ form ],
  methods: {
    async afterOpen (id) {
      if (id === undefined) {
        return
      }
      const res = await dibootApi.get(`/${this.name}/${id}`)
      if (res.code === 0) {
        this.initSubItem(res.data)
      } else {
        this.$notification.error({
          message: '获取数据失败',
          description: res.msg
        })
      }
    },
    initSubItem (data) {
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
    onTagClicked (item, i) {
      this.childItem.id = item.id
      this.childItem.itemName = item.itemName
      this.childItem.itemValue = item.itemValue
      this.childrenBtnConfig = {
        label: '更新子项',
        type: 'dashed',
        editing: true,
        currentIndex: i
      }
      return false
    },
    onTagClosed (e, i) {
      e.stopPropagation()
      if (this.children.length > i) {
        this.children.splice(i, 1)
      }
      e.preventDefault()
    },
    async checkTypeRepeat (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.model.id, type: value }
      const res = await dibootApi.get(`/${this.name}/checkTypeRepeat`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    },
    handleSubItem () {
      if (this.childItem.itemName === '') {
        this.$message.error('请输入数据字典子项名称')
        return false
      }
      if (this.childItem.itemValue === '') {
        this.$message.error('请输入数据字典子项编码')
        return false
      }

      if (this.childrenBtnConfig.currentIndex === undefined ||
        this.childrenBtnConfig.currentIndex >= this.children.length) {
        this.children.push(this.childItem)
      } else {
        this.children[this.childrenBtnConfig.currentIndex].id = this.childItem.id
        this.children[this.childrenBtnConfig.currentIndex].itemName = this.childItem.itemName
        this.children[this.childrenBtnConfig.currentIndex].itemValue = this.childItem.itemValue
      }

      // 重置
      this.childItem = _.cloneDeep(CHILDREN_ITEM_DEFAULT)
      this.childrenBtnConfig = _.cloneDeep(CHILDREN_BTN_CONFIG_DEFAULT)
    },
    close () {
      this.state.visible = false
      this.model = {}
      this.children = []
      this.form.resetFields()
    },
    enhance (values) {
      values.children = this.children
    }
  },
  props: {
    more: {
      type: Object,
      default: () => {
        return {}
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
