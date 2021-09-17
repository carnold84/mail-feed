<template>
  <div class="v_label">
    <c-header-bar class="header">
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
        <c-typography style="margin: 0;">{{ label?.name }}</c-typography>
      </template>
    </c-header-bar>
    <main class="content">
      <c-typography v-if="isLoading" style="height: 200px;">
        Loading...
      </c-typography>
      <div v-else class="list">
        <c-card
          v-for="message in messages"
          component="router-link"
          :key="message.id"
          :meta="formatDate(message.date)"
          :subTitle="message.subject"
          :title="message.from"
          :to="{
            name: 'Message',
            params: { labelId: label.id, messageId: message.id },
          }"
        />
      </div>
    </main>
  </div>
</template>

<script>
  import CCard from '../components/CCard.vue';
  import CHeaderBar from '@/components/CHeaderBar';
  import CIconButton from '@/components/CIconButton';
  import CTypography from '../components/CTypography.vue';

  export default {
    name: 'Label',
    components: {
      CCard,
      CIconButton,
      CHeaderBar,
      CTypography,
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
