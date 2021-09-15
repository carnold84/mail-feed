<template>
  <div class="v_message">
    <c-header-bar>
      <template v-slot:content-left>
        <c-button @click="$router.back()">
          Back
        </c-button>
      </template>
    </c-header-bar>
    <main class="content">
      <p v-if="isLoading">Loading...</p>
      <iframe v-else class="iframe" :src="src" />
    </main>
  </div>
</template>

<script>
  import CButton from '@/components/CButton';
  import CHeaderBar from '@/components/CHeaderBar';

  export default {
    name: 'Message',
    components: { CButton, CHeaderBar },
    data() {
      return {
        isLoading: false,
      };
    },
    computed: {
      labelId() {
        return this.$route?.params?.labelId;
      },
      label() {
        return this.$store.getters.getLabelById(this.labelId);
      },
      message() {
        return this.$store.getters.getMessageById({
          labelId: this.labelId,
          messageId: this.messageId,
        });
      },
      messageId() {
        return this.$route?.params?.messageId;
      },
      src() {
        if (this.message) {
          return `data:text/html;charset=utf-8,${escape(this.message.content)}`;
        }
        return undefined;
      },
    },
    async mounted() {
      console.log(this.label, this.message);
      this.isLoading = true;

      const gapi = await this.$gapi.getGapiClient();

      if (!this.label) {
        console.log('no label');
        const label = await gapi.client.gmail.users.labels.get({
          id: this.labelId,
          userId: 'me',
        });
        this.$store.dispatch('setLabel', label);
      }

      if (!this.message) {
        const message = await gapi.client.gmail.users.messages.get({
          id: this.messageId,
          userId: 'me',
        });

        console.log(message);

        this.$store.dispatch('setLabelMessage', {
          labelId: this.labelId,
          message,
        });
      }

      this.isLoading = false;
    },
  };
</script>

<style lang="scss" scoped>
  .v_message {
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

    .content {
      flex-grow: 1;
      position: relative;
    }

    .iframe {
      border: none;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }
  }
</style>
