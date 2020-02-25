<template>
  <div class="dashboard">
    <h2>欢迎您，{{ nickname() }}！</h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    ...mapGetters(['nickname'])
  }
}
</script>

<style scoped>
  .dashboard {
    min-height: 360px;
    background: #fff;
  }
  .dashboard h2 {
    line-height: 48px;
    padding-left: 24px;
  }
</style>
