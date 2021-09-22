<template>
  <q-layout view="lHh lpr lFf">
    <q-header>
      <q-toolbar class="text-primary bg-white g_tool_bar">
        <q-toolbar-title>
          <div class="logo">
            <img src="../assets/logo_full_hor.svg" height="24" />
          </div>
        </q-toolbar-title>
        <q-btn flat round dense icon="more_vert">
          <q-menu auto-close>
            <q-list style="min-width: 100px">
              <q-item clickable @click="signOut">
                <q-item-section>Sign Out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md">
        <c-loading v-if="isLoading" />
        <q-list v-else separator>
          <q-item
            v-for="label in labels"
            :key="label.id"
            :to="{ name: 'Label', params: { labelId: label.id } }"
            clickable
            v-ripple
          >
            <q-item-section side>
              <q-icon name="label" />
            </q-item-section>
            <q-item-section>{{ label.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
  import CLoading from '../components/CLoading.vue';

  export default {
    name: 'Home',
    components: {
      CLoading,
    },
    data() {
      return {
        isLoading: false,
      };
    },
    computed: {
      areLabelsLoaded() {
        return this.$store.getters['labels/areLabelsLoaded'];
      },
      labels() {
        return this.$store.getters['labels/getAllLabels'];
      },
    },
    async mounted() {
      if (this.areLabelsLoaded === false) {
        this.isLoading = true;

        await this.$store.dispatch('labels/fetchLabels');

        this.isLoading = false;
      }
    },
    methods: {
      async signOut() {
        await this.$store.dispatch('auth/signOut');

        this.$router.push('/sign-in');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .logo {
    align-items: center;
    display: flex;
    margin: 0 0 0 5px;
  }
</style>
