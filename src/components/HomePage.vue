<template>
  <div>
    <div>
      <header class="home-header">
        Mail Feed
        <button @click="$emit('sign-out')">Sign Out</button>
      </header>
      <main>
        <p v-if="labels === undefined">Loading...</p>
        <div v-else>
          <button
            v-for="label in labels"
            :key="label.id"
            @click="onLabelSelect(label)"
          >
            {{ label.name.replace('newsly_', '') }}
          </button>
        </div>
      </main>
    </div>
    <feed-page v-if="selectedLabel" :label="selectedLabel" />
  </div>
</template>

<script>
  import FeedPage from '@/components/FeedPage.vue';

  export default {
    components: { FeedPage },
    name: 'HomePage',
    data() {
      return {
        isLoading: null,
        labels: undefined,
        selectedLabel: null,
      };
    },
    async mounted() {
      const gapi = await this.$gapi.getGapiClient();
      const response = await gapi.client.gmail.users.labels.list({
        userId: 'me',
      });
      this.labels = response.result.labels.filter(({ name }) => {
        return name.includes('newsly_');
      });
    },
    methods: {
      onLabelSelect(label) {
        this.selectedLabel = label;
      },
    },
  };
</script>

<style scoped>
  .v_home_page {
    background-color: blanchedalmond;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
