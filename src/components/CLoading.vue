<template>
  <div class="c_loading">
    <q-circular-progress color="blue" indeterminate size="md" />
  </div>
</template>

<script>
  export default {
    name: 'CLoading',
  };
</script>

<style lang="scss" scoped>
  .c_loading {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
