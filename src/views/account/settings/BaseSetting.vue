<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical" :form="form">
          <a-form-item label="姓名">
            <a-input
              placeholder="请输入姓名"
              v-decorator="[
                'realname',
                {
                  initialValue: model.realname,
                  rules: [{ required: true, message: '姓名不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="性别">
            <a-select
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'gender',
                {
                  initialValue: model.gender,
                  rules: [{ required: true, message: '性别不能为空' }]
                }
              ]"
            >
              <a-select-option
                v-for="(gender, index) in more.genderOptions"
                :key="index"
                :value="gender.value"
              >
                {{ gender.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="电话">
            <a-input
              placeholder="电话"
              v-decorator="[
                'mobilePhone',
                {
                  initialValue: model.mobilePhone
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="邮箱">
            <a-input
              placeholder="xxx@xxx.com"
              v-decorator="[
                'email',
                {
                  initialValue: model.email
                }
              ]"
            />
          </a-form-item>
          <a-form-item>
            <a-button @click="onSubmit" type="primary">保存</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" style="display: none">
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal">

    </avatar-modal>
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'

export default {
  name: 'BaseSetting',
  components: {
    AvatarModal
  },
  data () {
    return {
      baseApi: '/iam/user',
      attachMoreList: [
        {
          target: 'GENDER'
        }
      ],
      model: {},
      form: this.$form.createForm(this),
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  methods: {
    async getCurrentUserInfo () {
      const res = await dibootApi.get('/iam/user/getCurrentUserInfo')
      if (res.code === 0) {
        this.model = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    /***
     * 更新记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async update (values) {
      const res = await dibootApi.post(`${this.baseApi}/updateCurrentUserInfo`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '保存成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    /***
     * 提交成功之后的处理
     * @param msg
     */
    submitSuccess (result) {
      this.$notification.success({
        message: '操作成功',
        description: result.msg
      })
      this.$store.commit('SET_NAME', { name: this.form.getFieldValue('realname'), welcome: '' })
    }
  },
  mixins: [ form ],
  async mounted () {
    await this.getCurrentUserInfo()
    await this.attachMore()
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
