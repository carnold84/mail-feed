<template>
  <q-layout view="lHh lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          :to="{ name: 'Label', params: { labelId } }"
        />
        <q-toolbar-title>
          <h3 class="text-subtitle2 title_text">
            {{ message?.from }}
          </h3>
          <h4 class="text-caption title_text">
            {{ message?.subject }}
          </h4>
        </q-toolbar-title>
        <q-btn
          :disable="message === undefined"
          flat
          round
          dense
          icon="mark_as_unread"
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
            ${encodeURIComponent(this.message.content)}
          `;
        }
        return undefined;
      },
    },
    async mounted() {
      this.isLoading = true;

      if (!this.label) {
        await this.$store.dispatch('loadLabel', this.labelId);
      }

      if (!this.label?.isLoaded) {
        await this.$store.dispatch('loadLabelMessage', {
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
      async toggleRead(isRead) {
        return await this.$store.dispatch('markMessageRead', {
          labelId: this.labelId,
          messageId: this.messageId,
          isRead,
        });
      },
      async onMarkUnread() {
        await this.toggleRead(false);

        this.$router.push({ name: 'Label', params: { labelId: this.labelId } });

        this.$q.notify(`Marked as ${this.message.isRead ? 'Read' : 'Unread'}`);
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
      margin: 2px 0 0;
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
