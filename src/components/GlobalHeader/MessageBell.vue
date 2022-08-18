<template>
  <a-popover placement="bottomRight" v-model="visible">
    <template slot="content">
      <a-tabs v-model="activeKey" style="width: 390px">
        <a-tab-pane key="unreadMessage" force-render>
          <template slot="tab">
            未读消息
            <a-badge :count="countMap.unreadMessage"/>
          </template>
          <MessageList
            ref="unreadMessage"
            :unread="true"
            @close="visible = false"
            @reset="$refs.allMessages && $refs.allMessages.refresh()"
            @total="value => $set(countMap, 'unreadMessage', value)"
          />
        </a-tab-pane>
        <a-tab-pane key="allMessages" tab="全部消息">
          <MessageList
            ref="allMessages"
            :unread="false"
            @reset="$refs.unreadMessage && $refs.unreadMessage.refresh()"
            @close="visible = false"
          />
        </a-tab-pane>
      </a-tabs>
    </template>
    <a-badge :offset="[-2, 5]" :count="sumCount">
      <a-button type="link" icon="bell" style="font-size: 18px;"></a-button>
    </a-badge>
  </a-popover>
</template>

<script>
import MessageList from './MessageList'

export default {
  name: 'MessageBell',
  components: { MessageList },
  data () {
    return {
      visible: true,
      activeKey: 'unreadMessage',
      countMap: {
        unreadMessage: 0
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.visible = false
    })
  },
  computed: {
    sumCount: function () {
      return Object.values(this.countMap).reduce((prev, next) => prev + next)
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
