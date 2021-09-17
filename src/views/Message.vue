<template>
  <div class="v_message">
    <c-header-bar>
      <template v-slot:content-left>
        <c-icon-button class="header_btn" @click="$router.back()">
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
      <template v-slot:content-right>
        <c-icon-button v-if="message" class="header_btn" @click="onToggleRead">
          <svg
            v-if="message.isRead"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 20H4C2.89543 20 2 19.1046 2 18V5.913C2.04661 4.84255 2.92853 3.99899 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20ZM4 7.868V18H20V7.868L12 13.2L4 7.868ZM4.8 6L12 10.8L19.2 6H4.8Z"
            />
          </svg>
          <svg
            v-if="!message.isRead"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 22H4C2.89543 22 2 21.1046 2 20V9.049C2.03375 8.37786 2.39728 7.76686 2.971 7.41699L10.971 2.61699C11.6041 2.23737 12.3949 2.23737 13.028 2.61699L21.028 7.41699C21.6292 7.77977 21.9976 8.42984 22 9.13199V20C22 21.1046 21.1046 22 20 22ZM4 9.86799V20H20V9.86799L12 15.201L4 9.86799ZM12 4.33199L5.316 8.34199L12 12.798L18.683 8.34199L12 4.33199Z"
            />
          </svg>
        </c-icon-button>
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
          return `
            data:text/html;charset=utf-8,
            <base target="_blank" />
            ${escape(this.message.content)}
          `;
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

      if (this.message.isRead === false) {
        this.onToggleRead();
      }
    },
    methods: {
      onToggleRead() {
        this.$store.dispatch('markMessageRead', {
          labelId: this.labelId,
          messageId: this.messageId,
          isRead: !this.message?.isRead,
        });
      },
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

    .header_btn {
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
