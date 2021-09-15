<template>
  <div class="v_message">
    <header class="header">
      Back
    </header>
    <main>
      <p v-if="isLoading">Loading...</p>
      <iframe v-else class="iframe" :src="src" />
    </main>
  </div>
</template>

<script>
  export default {
    name: 'Message',
    data() {
      return {
        isLoading: false,
      };
    },
    computed: {
      id() {
        return this.$route?.params?.id;
      },
      message() {
        return this.$store.getters.getMessageById(this.id);
      },
      src() {
        if (this.message) {
          return `data:text/html;charset=utf-8,${escape(this.message.content)}`;
        }
        return undefined;
      },
    },
    async mounted() {
      console.log(this.label, this.messages);
      this.isLoading = true;

      const gapi = await this.$gapi.getGapiClient();
      const response = await gapi.client.gmail.users.messages.get({
        id: this.id,
        userId: 'me',
      });

      console.log(response);

      this.$store.dispatch('setMessage', response);

      this.isLoading = false;
    },
  };
</script>

<style lang="scss" scoped>
  .v_message {
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
