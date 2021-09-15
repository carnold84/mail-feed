<template>
  <div class="v_message_page">
    <header class="header">
      Back
    </header>
    <iframe class="iframe" :src="src" />
  </div>
</template>

<script>
  export default {
    name: 'MessagePage',
    props: {
      message: {
        required: true,
        type: Object,
      },
    },
    computed: {
      src() {
        return `data:text/html;charset=utf-8,${escape(this.message.content)}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .v_message_page {
    background-color: darkgray;
    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    .header {
      height: 40px;
      width: 100%;
    }

    .iframe {
      border: none;
      flex-grow: 1;
      width: 100%;
    }
  }
</style>
