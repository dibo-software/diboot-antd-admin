/*
使用示例： 【key为对应属性名】（需mixin当前文件）
   <a-input
     placeholder="请输入"
+    :disabled="notEdit('key')"
     v-decorator="[
       'key',
       {
*        initialValue: !notEdit('key') ? null : model.key,
*        rules: notEdit('key') ? null : [{ required: true, message: 'key不能为空', whitespace: true }]
       }
     ]"
   >
+    <a v-if="!!model[primaryKey]" slot="addonAfter" @click="switchEdit('key')">{{ notEdit('key') ? '编辑' : '取消' }}</a>
   </a-input>
 */
export default {
  data () {
    return {
      /**
       * 是否含有保护属性
       */
      _protect: false
    }
  },
  methods: {
    /**
     * 不是编辑返回
     * @param key 属性名
     * @returns {boolean} 不是编辑返回false，反之true
     */
    notEdit (key) {
      if (this.model[this.primaryKey]) {
        this._protect = true
        const keyEdit = this.model[`${key}_edit`]
        keyEdit == null && this.switchEdit(key, false)
        return !keyEdit
      }
      return false
    },
    /**
     * 切换编辑
     * @param key 属性名
     * @param isEdit 要切换的状态
     */
    switchEdit (key, isEdit = !this.model[`${key}_edit`]) {
      !this.$set(this.model, `${key}_edit`, isEdit) && this.form.resetFields([`${key}`])
    },
    /**
     * 提交前的验证流程
     * @returns {Promise<any>}
     */
    validate () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            // 有保护属性时需进行过滤，过滤掉非编辑的保护属性
            this._protect && Object.keys(values).forEach(k => `${this.model[`${k}_edit`]}` === 'false' && delete values[k])
            resolve(values)
          } else {
            this.state.confirmSubmit = false
            reject(err)
          }
        })
      })
    }
  }
}
