<template>
  <table class="c_table">
    <thead>
      <slot name="head" />
    </thead>
    <tbody>
      <slot name="body" />
    </tbody>
  </table>
</template>

<script>
  export default {
    name: 'CTable',
  };
</script>

<style lang="scss" scoped>
  .c_table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
  }
</style>
