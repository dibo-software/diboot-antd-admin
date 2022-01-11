<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="state.visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form layout="vertical" :form="form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="类型名称">
            <a-input
              placeholder="数据字典类型名称"
              v-decorator="[
                'itemName',
                {
                  initialValue: model.itemName,
                  rules: [{ required: true, message: '类型名称不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="类型编码">
            <a-input
              placeholder="数据字典类型名称(大写英文字母)"
              v-decorator="[
                'type',
                {
                  initialValue: model.type,
                  rules: [
                    { required: true, message: '类型编码不能为空', whitespace: true },
                    { validator: this.checkTypeDuplicate }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="包含子项">
            <a-row :gutter="16" v-if="children.length > 0">
              <a-col :span="24" style="margin-left: -6px">
                <template v-for="(item,i) in children">
                  <a-tag
                    closable
                    color="blue"
                    :key="i"
                    :style="{ padding: '5px', margin: '5px 6px', height: '30px', lineHeight: '16px' }"
                    @click="onTagClicked(item, i)"
                    @close="onTagClosed($event, i)"
                    v-decorator="[
                      'children',
                      {
                        initialValue: children,
                        rules: [{ required: true, message: '子项不能为空'}]
                      }
                    ]"
                  >
                    {{ item.itemName }}({{ item.itemValue }})
                  </a-tag>
                </template>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-input placeholder="子项名称" v-model="childItem.itemName" />
              </a-col>
              <a-col :span="8">
                <a-input placeholder="子项编码" v-model="childItem.itemValue" />
              </a-col>
              <a-col :span="8">
                <a-button :type="childrenBtnConfig.type" @click="handleSubItem">{{ childrenBtnConfig.label }}</a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16" v-show="children && children.length > 0 && !childItem.itemName && !childItem.itemValue">
        <a-col :span="24">
          <a-form-item label="拖拽排序">
            <draggable element="span" v-model="children">
              <a-tag
                class="draggable-element"
                color="blue"
                :key="i"
                v-for="(item, i) in children">
                {{ item.itemName }}({{ item.itemValue }})
              </a-tag>
            </draggable>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="备注">
            <a-textarea
              :rows="5"
              placeholder="备注"
              v-decorator="[
                'description',
                {
                  initialValue: model.description
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div class="drawer-footer">
      <a-button @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import draggable from 'vuedraggable'
import _ from 'lodash'
// 定义默认值
const CHILDREN_BTN_CONFIG_DEFAULT = {
  editing: false,
  type: 'primary',
  label: '添加子项',
  currentIndex: undefined
}
const CHILDREN_ITEM_DEFAULT = { id: '', itemName: '', itemValue: '' }
export default {
  name: 'DictionaryDrawer',
  data () {
    return {
      baseApi: '/dictionary',
      form: this.$form.createForm(this),
      children: [],
      childItem: _.cloneDeep(CHILDREN_ITEM_DEFAULT),
      childrenBtnConfig: _.cloneDeep(CHILDREN_BTN_CONFIG_DEFAULT)
    }
  },
  mixins: [ form ],
  methods: {
    async afterOpen (id) {
      if (id == null) {
        return
      }
      const res = await dibootApi.get(`${this.baseApi}/${id}`)
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
    async checkTypeDuplicate (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.model.id, type: value }
      const res = await dibootApi.get(`${this.baseApi}/checkTypeDuplicate`, params)
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
      for (let i = 0; i < this.children.length; i++) {
        if (this.childrenBtnConfig.currentIndex !== i && this.children[i].itemValue === this.childItem.itemValue) {
          this.$message.error('数据字典子项编码值重复')
          return false
        }
      }
      if (this.childItem.itemValue.indexOf(',') >= 0) {
        this.$message.warning('数据字典子项编码不建议包含英文逗号')
      }

      if (this.childrenBtnConfig.currentIndex == null ||
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
    afterClose () {
      this.children = []
      this.childrenBtnConfig = _.cloneDeep(CHILDREN_BTN_CONFIG_DEFAULT)
      this.childItem = _.cloneDeep(CHILDREN_ITEM_DEFAULT)
    },
    enhance (values) {
      values.children = this.children
    }
  },
  components: {
    draggable
  }
}
</script>

<style scoped>
.draggable-element{
  cursor: move;
}
</style>
