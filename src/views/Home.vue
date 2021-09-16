<template>
  <div class="v_home">
    <c-header-bar class="header">
      <template v-slot:content-left>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 20H4C2.89543 20 2 19.1046 2 18V5.913C2.04661 4.84255 2.92853 3.99899 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20ZM4 7.868V18H20V7.868L12 13.2L4 7.868ZM4.8 6L12 10.8L19.2 6H4.8Z"
            fill="#ffffff"
          />
        </svg>
        <c-typography component="h2" variant="h5" style="margin: 0 0 0 10px;">
          Newsly
        </c-typography>
      </template>
      <template v-slot:content-right>
        <c-button @click="signOut">
          Sign Out
        </c-button>
      </template>
    </c-header-bar>
    <main class="content">
      <div v-if="isLoading" style="height: 200px; width: 100%;">Loading...</div>
      <c-table v-else>
        <template v-slot:body>
          <c-table-row v-for="label in labels" :key="label.id">
            <c-table-cell>
              <router-link
                :to="{ name: 'Label', params: { labelId: label.id } }"
              >
                {{ label.name.replace('newsly_', '') }}
              </router-link>
            </c-table-cell>
          </c-table-row>
        </template>
      </c-table>
    </main>
  </div>
</template>

<script>
  import CButton from '@/components/CButton';
  import CHeaderBar from '@/components/CHeaderBar';
  import CTable from '@/components/CTable.vue';
  import CTableCell from '@/components/CTableCell.vue';
  import CTableRow from '@/components/CTableRow.vue';
  import CTypography from '../components/CTypography.vue';

  export default {
    name: 'Home',
    components: {
      CButton,
      CHeaderBar,
      CTable,
      CTableCell,
      CTableRow,
      CTypography,
    },
    data() {
      return {
        isLoading: null,
      };
    },
    async mounted() {
      if (this.areLabelsLoaded === false) {
        this.isLoading = true;

        this.$store.dispatch('loadLabels');

        this.isLoading = false;
      }
    },
    computed: {
      areLabelsLoaded() {
        return this.$store.getters.areLabelsLoaded;
      },
      labels() {
        return this.$store.getters.getAllLabels;
      },
    },
    methods: {
      async signOut() {
        await this.$store.dispatch('signOut');

        this.$router.push('/sign-in');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .v_home {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;

    .header {
      z-index: 1;
    }

    .content {
      background-color: #ffffff;
      flex-grow: 1;
      padding: 30px;
      position: relative;
    }
  }
</style>
