<template>
  <div class="v_message">
    <c-header-bar>
      <template v-slot:content-left>
        <c-icon-button class="back_btn" @click="$router.back()">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.83 11L11.41 7.41L10 6L4 12L10 18L11.41 16.59L7.83 13H20V11H7.83Z"
            />
          </svg>
        </c-icon-button>
        <c-typography style="margin: 0;">{{ message?.subject }}</c-typography>
      </template>
    </c-header-bar>
    <main class="content">
      <p v-if="isLoading">Loading...</p>
      <iframe v-else class="iframe" :src="src" />
    </main>
  </div>
</template>

<script>
  import CHeaderBar from '@/components/CHeaderBar';
  import CIconButton from '@/components/CIconButton';
  import CTypography from '../components/CTypography.vue';

  export default {
    name: 'Message',
    components: { CIconButton, CHeaderBar, CTypography },
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

    .back_btn {
      fill: #ffffff;
      margin: 0 5px 0 0;
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
