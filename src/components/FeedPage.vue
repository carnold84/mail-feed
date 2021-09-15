<template>
  <div class="v_feed_page">
    <header class="home_header">
      {{ label.name }}
      <button @click="$emit('sign-out')">Sign Out</button>
    </header>
    <main>
      <p v-if="messages === undefined">Loading...</p>
      <div v-else>
        <button
          v-for="message in messages"
          :key="message.id"
          @click="onMessageSelect(message)"
        >
          {{ message.subject }}
        </button>
      </div>
    </main>
    <message-page v-if="selectedMessage" :message="selectedMessage" />
  </div>
</template>

<script>
  import { extractContent, extractField } from '@/utils/email';
  import MessagePage from '@/components/MessagePage';

  export default {
    name: 'FeedPage',
    components: { MessagePage },
    data() {
      return {
        isLoading: null,
        messages: undefined,
        selectedMessage: null,
      };
    },
    props: {
      label: {
        required: true,
        type: Object,
      },
    },
    async mounted() {
      const gapi = await this.$gapi.getGapiClient();
      const response = await gapi.client.gmail.users.messages.list({
        labelIds: [this.label.id],
        userId: 'me',
      });

      const messageResponse = await Promise.all(
        response.result.messages.map(({ id }) => {
          return gapi.client.gmail.users.messages.get({
            id,
            userId: 'me',
          });
        })
      );

      const nextMessages = messageResponse.map(({ result }) => {
        return {
          ...result,
          content: extractContent(result),
          date: extractField(result, 'Date'),
          from: extractField(result, 'From'),
          subject: extractField(result, 'Subject'),
        };
      });

      this.messages = nextMessages;
    },
    methods: {
      onMessageSelect(message) {
        this.selectedMessage = message;
      },
    },
  };
</script>

<style scoped>
  .v_feed_page {
    background-color: aliceblue;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
