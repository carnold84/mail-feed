<template>
  <tr class="c_table_row">
    <slot />
  </tr>
</template>

<script>
  export default {
    name: 'CTableRow',
  };
</script>

<style lang="scss" scoped>
  .c_table_row {
    border-bottom: 1px solid #eeeeee;
    width: 100%;
  }
</style>
