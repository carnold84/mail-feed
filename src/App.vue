<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    name: 'Home',
  };
</script>

<style lang="scss">
  html {
    -webkit-font-smoothing: antialiased;
  }

  .g_tool_bar {
    border-bottom: 1px solid #eeeeee;
    height: 60px;
  }
</style>
