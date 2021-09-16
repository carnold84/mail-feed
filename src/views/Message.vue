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
      const requests = [];

      if (!this.label) {
        requests.push(this.$store.dispatch('loadLabel', this.labelId));
      }

      if (!this.label?.isLoaded) {
        requests.push(
          this.$store.dispatch('loadLabelMessage', {
            labelId: this.labelId,
            messageId: this.messageId,
          })
        );
      }

      if (requests.length > 0) {
        this.isLoading = true;

        await Promise.all(requests);

        this.isLoading = false;
      }
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
