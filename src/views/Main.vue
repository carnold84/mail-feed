<template>
  <div class="v_main">
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <home-view :is-disabled="location === 'label'" />
      <transition-group name="over">
        <label-view v-if="location === 'label'" />
        <message-view v-if="location === 'message'" />
      </transition-group>
    </div>
  </div>
</template>

<script>
  import HomeView from '@/views/Home.vue';
  import LabelView from '@/views/Label.vue';
  import MessageView from '@/views/Message.vue';

  export default {
    components: { HomeView, LabelView, MessageView },
    name: 'Main',
    data() {
      return {
        isLoading: null,
      };
    },
    async mounted() {
      this.isLoading = true;

      const gapi = await this.$gapi.getGapiClient();
      const response = await gapi.client.gmail.users.labels.list({
        userId: 'me',
      });

      this.$store.dispatch('setLabels', response);

      this.isLoading = false;
    },
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
