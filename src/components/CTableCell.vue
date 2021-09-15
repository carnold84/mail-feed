<template>
  <component
    :class="['c_table_cell', { is_controls: isControls }]"
    :is="isHeader ? 'th' : 'td'"
  >
    <slot />
  </component>
</template>

<script>
  export default {
    name: 'CTableCell',
    props: {
      isControls: {
        default: false,
        type: Boolean,
      },
      isHeader: {
        default: false,
        type: Boolean,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .c_table_cell {
    font-size: 1.6rem;
    padding: 10px 20px;
    text-align: left;
    width: 100%;

    &.is_controls {
      text-align: right;

      & > * {
        margin: 0 0 0 10px;
      }
    }
  }
</style>
