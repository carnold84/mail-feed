<template>
  <q-layout view="lHh lpr lFf">
    <q-header>
      <q-toolbar class="text-primary bg-white g_tool_bar">
        <q-btn flat round dense icon="arrow_back" :to="{ name: 'Home' }" />
        <q-toolbar-title>
          <h3 class="text-subtitle1 title_text">
            {{ label?.name }}
          </h3>
        </q-toolbar-title>
        <q-toggle
          v-model="showRead"
          label="Show Read"
          left-label
          @update:model-value="onToggleShowRead"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md">
        <c-loading v-if="isLoading" />
        <q-list v-else separator>
          <q-item
            v-for="message in messages"
            :class="{ is_read: message.isRead }"
            clickable
            :key="message.id"
            :to="{
              name: 'Message',
              params: { labelId: label.id, messageId: message.id },
            }"
            v-ripple
          >
            <q-item-section>
              <q-item-label>
                <span class="text-weight-bold">
                  {{ message.from }}
                </span>
              </q-item-label>
              <q-item-label :lines="1" style="margin-top: 7px;">
                {{ message.subject }}
              </q-item-label>
              <div class="meta">
                <q-item-label caption>{{
                  formatDate(message.date)
                }}</q-item-label>
                <q-badge
                  v-if="!message.isRead"
                  outline
                  color="grey"
                  label="Unread"
                />
              </div>
            </q-item-section>
          </q-item>
          <q-item style="justify-content: center;">
            <q-btn
              color="primary"
              :loading="isLoadingMore"
              rounded
              style="margin: 10px 0;"
              unelevated
              @click="onLoadMore"
            >
              Load More
            </q-btn>
          </q-item>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
  import CLoading from '@/components/CLoading';

  export default {
    name: 'Label',
    components: {
      CLoading,
    },
    data() {
      return {
        isLoading: false,
        isLoadingMore: false,
        showRead: this.$store.getters['messages/getShowRead'],
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
      messages() {
        return this.$store.getters['messages/getMessagesByLabel']({
          labelId: this.labelId,
        });
      },
    },
    async mounted() {
      const requests = [];

      if (!this.label) {
        requests.push(this.$store.dispatch('labels/fetchLabel', this.labelId));
      }

      if (!this.areMessagesLoaded) {
        requests.push(this.loadMore());
      }

      if (requests.length > 0) {
        this.isLoading = true;

        await Promise.all(requests);

        this.isLoading = false;
      }
    },
    methods: {
      async loadMore(reset = false) {
        await this.$store.dispatch('messages/fetchNextMessages', {
          labelId: this.labelId,
          reset,
        });
      },
      async onLoadMore() {
        this.isLoadingMore = true;

        await this.loadMore();

        this.isLoadingMore = false;
      },
      async onToggleShowRead(value) {
        this.isLoading = true;

        this.$store.dispatch('messages/setShowRead', value);

        await this.loadMore(true);

        this.isLoading = false;
      },
      formatDate(date) {
        const dateTime = new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'full',
        });
        return dateTime.format(new Date(date));
      },
    },
  };
</script>

<style lang="scss" scoped>
  .is_read {
    opacity: 0.5;
  }

  .title_text {
    margin: 2px 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .meta {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 7px 0 0;
  }
</style>
