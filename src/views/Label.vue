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
        <div v-if="label" class="row items-center">
          <p class="text-body q-ma-none" style="margin: 0 10px 0 0">
            1 - 20 of {{ label.messagesTotal }}
          </p>
          <q-btn
            flat
            round
            dense
            :disable="!prevPageToken"
            icon="chevron_left"
            @click="onPrevMessages"
          />
          <q-btn
            flat
            round
            dense
            :disable="!nextPageToken"
            icon="chevron_right"
            @click="onNextMessages"
          />
        </div>
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
      };
    },
    computed: {
      labelId() {
        return this.$route?.params?.labelId;
      },
      label() {
        return this.$store.getters.getLabelById(this.labelId);
      },
      messages() {
        return this.$store.getters.getMessagesByLabel(this.labelId, {
          sortBy: {
            direction: 'desc',
            field: 'date',
          },
        });
      },
      nextPageToken() {
        return this.$store.getters.getLabelNextPageToken(this.labelId);
      },
      prevPageToken() {
        return this.$store.getters.getLabelPrevPageToken(this.labelId);
      },
    },
    async mounted() {
      const requests = [];

      if (!this.label) {
        requests.push(this.$store.dispatch('loadLabel', this.labelId));
      }

      if (!this.label?.isLoaded) {
        requests.push(
          this.$store.dispatch('loadLabelMessages', {
            labelId: this.labelId,
            maxResults: 20,
            pageToken: this.pageToken,
          })
        );
      }

      if (requests.length > 0) {
        this.isLoading = true;

        await Promise.all(requests);

        this.isLoading = false;
      }
    },
    methods: {
      formatDate(date) {
        const dateTime = new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'full',
        });
        return dateTime.format(new Date(date));
      },
      async onNextMessages() {
        console.log('onNextMessages');

        this.isLoading = true;

        await this.$store.dispatch('loadLabelMessages', {
          labelId: this.labelId,
          maxResults: 20,
          pageToken: this.nextPageToken,
        });

        this.isLoading = false;
      },
      async onPrevMessages() {
        console.log('onPrevMessages');

        this.isLoading = true;

        await this.$store.dispatch('loadLabelMessages', {
          labelId: this.labelId,
          maxResults: 20,
          pageToken: this.nextPageToken,
        });

        this.isLoading = false;
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
