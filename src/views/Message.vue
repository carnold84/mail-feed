<template>
  <q-layout view="lHh lpr lFf">
    <q-header>
      <q-toolbar class="text-primary bg-white g_tool_bar">
        <q-btn flat round dense icon="arrow_back" @click="onBack" />
        <q-toolbar-title>
          <h3 class="text-subtitle1 title_text">
            {{ message?.from }}
          </h3>
          <h4 class="text-subtitle2 title_text">
            {{ message?.subject }}
          </h4>
        </q-toolbar-title>
        <q-btn
          dense
          :disable="message === undefined"
          flat
          icon="mark_as_unread"
          :loading="isMarkingRead"
          round
          @click="onMarkUnread"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <c-loading v-if="isLoading" />
        <iframe v-else class="iframe" :src="src" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
  import CLoading from '@/components/CLoading.vue';

  export default {
    components: { CLoading },
    name: 'Message',
    data() {
      return {
        isLoading: false,
        isMarkingRead: false,
      };
    },
    computed: {
      areMessagesLoaded() {
        return this.$store.getters['messages/getAreMessagesLoaded'](
          this.labelId
        );
      },
      labelId() {
        return this.$route?.params?.labelId;
      },
      label() {
        return this.$store.getters['labels/getLabelById'](this.labelId);
      },
      message() {
        return this.$store.getters['messages/getMessageById'](this.messageId);
      },
      messageId() {
        return this.$route?.params?.messageId;
      },
      src() {
        if (this.message) {
          return `
            data:text/html;charset=utf-8,
            <base target="_blank" />
            ${encodeURIComponent(this.message.content)}
          `;
        }
        return undefined;
      },
    },
    async mounted() {
      this.isLoading = true;

      if (!this.label) {
        await this.$store.dispatch('labels/fetchLabel', this.labelId);
      }

      if (!this.areMessagesLoaded) {
        await this.$store.dispatch('messages/fetchMessage', {
          labelId: this.labelId,
          messageId: this.messageId,
        });
      }

      if (this.message.isRead === false) {
        await this.toggleRead(true);
      }

      this.isLoading = false;
    },
    methods: {
      onBack() {
        this.$router.back();
      },
      async onMarkUnread() {
        this.isMarkingRead = true;

        await this.toggleRead(false);

        this.isMarkingRead = false;

        this.$router.back();

        this.$q.notify({
          color: 'primary',
          message: `Marked as ${this.message.isRead ? 'Read' : 'Unread'}`,
        });
      },
      async toggleRead(isRead) {
        return await this.$store.dispatch('messages/markMessageRead', {
          messageId: this.messageId,
          isRead,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .title_text {
    line-height: 1rem;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:nth-child(2) {
      margin: 4px 0 0;
    }
  }

  .iframe {
    border: none;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
