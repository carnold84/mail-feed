<template>
  <div class="v_label">
    <header class="header">
      {{ label?.name }}
      <button @click="$emit('sign-out')">Sign Out</button>
    </header>
    <main>
      <p v-if="isLoading">Loading...</p>
      <ul v-else>
        <li v-for="message in messages" :key="message.id">
          <router-link :to="{ name: 'Message', params: { id: message.id } }">
            {{ message.subject }}
          </router-link>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'Label',
    data() {
      return {
        isLoading: null,
      };
    },
    computed: {
      id() {
        return this.$route?.params?.id;
      },
      label() {
        return this.$store.getters.getLabelById(this.id);
      },
      messages() {
        return this.$store.getters.getMessagesByLabel(this.id);
      },
    },
    async mounted() {
      console.log(this.label, this.messages);
      this.isLoading = true;

      const gapi = await this.$gapi.getGapiClient();
      const response = await gapi.client.gmail.users.messages.list({
        labelIds: [this.id],
        userId: 'me',
      });

      const messageResponse = await Promise.all(
        response.result.messages.map(({ id }) => {
          return gapi.client.gmail.users.messages.get({
            id,
            format: 'METADATA',
            metadataHeaders: ['Date', 'From', 'Subject'],
            userId: 'me',
          });
        })
      );

      console.log(messageResponse);

      this.$store.dispatch('setMessages', messageResponse);

      this.isLoading = false;
    },
  };
</script>

<style scoped>
  .v_label {
    background-color: aliceblue;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
