<template>
  <div class="v_main">
    <home-view :is-disabled="location === 'label'" />
    <transition-group name="over">
      <label-view v-if="location === 'label'" />
      <message-view v-if="location === 'message'" />
    </transition-group>
  </div>
</template>

<script>
  import HomeView from '@/views/Home.vue';
  import LabelView from '@/views/Label.vue';
  import MessageView from '@/views/Message.vue';

  export default {
    components: { HomeView, LabelView, MessageView },
    name: 'Main',
    computed: {
      location() {
        const { name } = this.$route;
        console.log(name);

        if (name === 'Label') {
          return 'label';
        } else if (name === 'Message') {
          return 'message';
        }

        return null;
      },
    },
  };
</script>

<style scoped>
  .v_main {
    background-color: blanchedalmond;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
