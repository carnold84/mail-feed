<template>
  <div class="v_main">
    <home
      :is-disabled="selectedLabel || selectedMessage"
      @label-select="selectedLabel = $event"
    />
    <transition name="over">
      <feed
        v-if="selectedLabel"
        :label="selectedLabel"
        @message-select="selectedMessage = $event"
      />
      <message v-if="selectedMessage" :message="selectedMessage" />
    </transition>
  </div>
</template>

<script>
  import Feed from '@/views/Feed.vue';
  import Home from '@/views/Home.vue';
  import Message from './Message.vue';

  export default {
    components: { Feed, Home, Message },
    name: 'Main',
    data() {
      return {
        isLoading: null,
        selectedLabel: null,
        selectedMessage: null,
      };
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
