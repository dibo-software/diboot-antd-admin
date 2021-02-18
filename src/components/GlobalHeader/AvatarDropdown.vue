<template>
  <a-dropdown placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" :src="avatar()" class="antd-pro-global-header-index-avatar" />
      <span>{{ nickname() }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="dashboard" @click="to('/dashboard')">
          <a-icon type="appstore"/>
          工作台
        </a-menu-item>
        <a-menu-item v-if="menu" key="center" @click="to('/account/settings')">
          <a-icon type="user" />
          {{ $t('menu.account.center') }}
        </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="to('/account/settings/changePwd')">
          <a-icon type="setting" />
          更改密码
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          {{ $t('menu.account.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AvatarDropdown',
  props: {
    menu: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar']),
    to (path) {
      this.$router.push(path)
    },
    handleLogout (e) {
      const that = this
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          return that.Logout({}).then(() => {
            that.$router.push('/user/login')
            that.$router.go(0)
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
