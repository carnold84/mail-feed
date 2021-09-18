<template>
  <q-layout view="lHh lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" :to="{ name: 'Home' }" />
        <q-toolbar-title>
          {{ label?.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-lg">
        <c-loading v-if="isLoading" />
        <q-list v-else separator>
          <q-item
            v-for="message in messages"
            clickable
            :key="message.id"
            :to="{
              name: 'Message',
              params: { labelId: label.id, messageId: message.id },
            }"
            v-ripple
          >
            <q-item-section>
              <q-item-label>{{ message.from }}</q-item-label>
              <q-item-label>{{ message.subject }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{
                formatDate(message.date)
              }}</q-item-label>
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
    },
    async mounted() {
      const requests = [];

      if (!this.label) {
        requests.push(this.$store.dispatch('loadLabel', this.labelId));
      }

      if (!this.label?.isLoaded) {
        requests.push(this.$store.dispatch('loadLabelMessages', this.labelId));
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
    },
  };
</script>

<style lang="scss" scoped>
  .v_label {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;

    .header {
      z-index: 1;
    }

    .back_btn {
      fill: #ffffff;
      margin: 0 5px 0 0;
    }

    .content {
      background-color: #ffffff;
      flex-grow: 1;
      padding: 30px;
      position: relative;
    }
  }
</style>
