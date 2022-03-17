<template>
  <a-card :bordered="false">
    <a-empty v-if="!type" description="无系统配置项"/>
    <a-tabs v-else v-model="type">
      <a-button
        slot="tabBarExtraContent"
        v-if="editable"
        icon="close"
        type="danger"
        ghost
        @click="deleteConfig()">
        重置
      </a-button>
      <a-tab-pane v-for="item in typeList" :key="item.value" :tab="item.label || '(未命名)'">
        <div style="margin: 3vh 10vw">
          <div v-if="editable" style="color: #AAAAAA; text-align: end; zoom: 0.9;">双击编辑</div>
          <table>
            <tr v-for="config in configList" :key="config.prop">
              <th style="padding: 15px">
                {{ config.propLabel }}
                <span v-show="config._edit && config.required" style="color: red">*</span>
              </th>
              <td>
                <span v-if="typeof config.defaultValue === 'boolean'" style="margin-left: 10px">
                  <a-switch v-if="editable" v-model="config.value" @change="update(config)"/>
                  <a-tag v-else :color="config.value ? 'green' : ''">
                    {{ config.value }}
                  </a-tag>
                </span>
                <span v-else-if="config._edit">
                  <a-select
                    v-if="config.options"
                    v-model="config.value"
                    @blur="config._edit = false"
                    @change="update(config)"
                    style="width: calc(100% - 20px);margin-left: 10px"
                  >
                    <a-select-option v-for="option in config.options" :key="option">
                      {{ option }}
                    </a-select-option>
                  </a-select>
                  <span v-else>
                    <a-input
                      style="width: calc(100% - 100px);margin-left: 10px"
                      v-focus
                      v-model="config.value"
                      @blur="getConfigData"
                      @keyup.enter.native="update(config)"
                    />
                    <a-icon type="check-circle" class="action-icon" style="color: #00FF00;" @mousedown="update(config)"/>
                    <a-icon type="close-circle" class="action-icon" style="color: orange;" @mousedown="deleteConfig(config.prop)"/>
                  </span>
                </span>
                <span v-else class="content" :style="editable ? { cursor: 'pointer'} : {}" @dblclick="edit(config)">
                  {{ config.value }}
                </span>
              </td>
            </tr>
          </table>
          <a-collapse v-if="item.ext && editable" style="margin-top: 39px">
            <a-collapse-panel key="1" header="配置测试">
              <a-input
                v-for="key in item.ext"
                :key="key"
                v-model="item.data[key]"
                :placeholder="key"
                style="margin-bottom: 10px"
              />
              <a-button type="primary" ghost @click="configTest(item.data)">测试</a-button>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { dibootApi } from '@/utils/request'
import { hasPermissions } from '@/core/permission/checkPermission'

export default {
  name: 'SystemConfig',
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  },
  data () {
    return {
      baseApi: '/systemConfig',
      type: null,
      typeList: [],
      configList: []
    }
  },
  computed: {
    editable () {
      return hasPermissions(['update'], this)
    }
  },
  watch: {
    type (type) {
      if (type) {
        this.getConfigData()
      }
    }
  },
  created () {
    dibootApi.get(`${this.baseApi}/typeList`).then(res => {
      this.typeList = res.data
      if (this.typeList && this.typeList.length > 0) {
        this.type = res.data[0].value
        res.data.forEach(e => {
          if (e.ext) {
            this.$set(e, 'data', {})
          }
        })
      }
    })
  },
  methods: {
    getConfigData () {
      dibootApi.get(`${this.baseApi}/${this.type}`).then(res => {
        res.data.forEach(e => typeof e.defaultValue === 'boolean' && this.$set(e, 'value', e.value === 'true'))
        this.configList = res.data
      })
    },
    edit (data) {
      if (this.editable) {
        this.$set(data, '_edit', true)
      }
    },
    update (data) {
      if (data.required && (data.value == null || `${data.value}`.trim().length === 0)) {
        return this.$message.error('不能为空')
      }
      dibootApi.post(`${this.baseApi}`, data).then(res => {
        if (res.ok) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败，稍后重试！')
        }
        this.getConfigData()
      })
    },
    deleteConfig (prop = '') {
      const _this = this
      this.$confirm({
        title: '提示',
        content: `重置${prop ? '该配置' : `·${this.typeList.find(e => e.value === this.type).label}·`}, 是否继续?`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          dibootApi.delete(`${_this.baseApi}/${_this.type}/${prop}`).then(res => {
            if (res.ok) {
              _this.$message.success('重置成功')
            } else {
              _this.$message.error('重置失败，稍后重试！')
            }
            _this.getConfigData()
          })
        }
      })
    },
    configTest (data) {
      dibootApi.post(`${this.baseApi}/${this.type}`, data).then(res => {
        if (res.ok) {
          this.$message.success('操作成功')
        } else {
          this.$notification.error({
            title: '测试失败',
            message: res.msg,
            duration: 0
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
table, table tr th, table tr td {
  border: 1px solid #e8e8e8;
}

table {
  border-collapse: collapse;

  tr {
    th {
      background-color: #fafafa;
      width: 220px;
    }

    td {
      text-align: left;
      width: 100vw;
    }
  }
}

.action-icon {
  zoom: 2;
  cursor: pointer;
  margin-left: 6px;
  vertical-align: middle;
}

.content {
  width: 100%;
  height: 20px;
  padding: 0 10px;
  display: inline-block;
}

</style>
