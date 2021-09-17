<template>
  <div class="v_home">
    <c-header-bar class="header">
      <template v-slot:content-left>
        <svg
          width="28"
          height="28"
          style="fill: #ffffff;"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64ZM10.895 31.5414L16.3027 40.9078C16.5972 41.4777 17.036 41.9604 17.5755 42.3075C17.9632 42.5578 21.6151 44.4457 24.4113 45.8913L24.6573 46.0185C24.8142 46.0996 24.9678 46.179 25.1175 46.2564C26.4819 46.9614 27.5191 47.4975 27.7158 47.6077C27.7893 47.8462 27.8895 48.0756 28.0144 48.2917C28.6586 49.3904 29.8256 50.0775 31.099 50.1077C34.4417 50.1496 37.837 50.1527 41.1879 50.1085C43.0426 50.0753 44.5756 48.6526 44.7469 46.8055C44.7514 46.743 44.7673 45.6654 44.8162 40.8885L44.8193 40.6083L44.8979 34.4847C44.9138 33.2592 44.9306 31.9805 44.9474 30.7012C45.025 24.7767 45.1027 18.8394 45.1055 18.1124L45.1074 18.0599C45.1836 17.2783 45.0175 16.4922 44.6318 15.8081C43.9974 14.6868 42.8208 13.9808 41.5328 13.949C38.2565 13.9073 34.8604 13.9026 31.4439 13.9482C29.5875 13.9943 28.0587 15.4214 27.8852 17.2703L12.3094 26.263C10.463 27.3314 9.8302 29.693 10.895 31.5414ZM13.8548 28.9398L24.9121 22.5559C22.3329 26.9589 19.7079 31.5275 17.1161 36.1348L13.5718 29.996C13.3583 29.6262 13.485 29.1533 13.8548 28.9398ZM25.4397 27.8785C26.6157 25.8317 27.5482 24.2088 27.7768 23.8094L27.7676 23.8083L27.7773 23.8027L27.7953 23.7709L27.8064 23.7495L27.6849 33.2251C27.6683 34.4451 27.6519 35.6491 27.6364 36.7862C27.5859 40.4881 27.5451 43.4794 27.5406 43.9963C27.4618 43.9562 19.5109 39.8563 19.2637 39.71C19.1865 39.6616 19.1224 39.5949 19.0768 39.516C18.9902 39.3664 18.9781 39.1851 19.044 39.0254C19.0763 38.9537 22.8489 32.3876 25.4397 27.8785ZM31.458 17.0467C31.5749 17.0305 38.4345 16.9411 41.2711 17.0333L41.2701 17.0317L41.3145 17.0382L41.367 17.0401L41.375 17.0354L41.4183 17.0361L41.4449 17.0379L41.4707 17.038C41.6657 17.0489 41.8421 17.1569 41.9407 17.3254C41.9792 17.393 42.004 17.4674 42.0136 17.5445C42.033 17.7153 41.6745 46.175 41.6702 46.4494C41.66 46.734 41.4467 46.9701 41.1646 47.0089C41.144 47.0102 34.1227 47.0495 31.173 47.0097C30.9716 47.0052 30.7873 46.8956 30.6872 46.7207C30.6705 46.6962 30.6556 46.6704 30.6427 46.6437C30.5628 46.4355 30.9059 21.0886 30.9488 17.9245C30.9514 17.7308 30.9529 17.6202 30.9531 17.6037C30.9614 17.3191 31.1755 17.0828 31.458 17.0467ZM34.8403 20.0781C33.3643 20.9311 32.8583 22.8187 33.7098 24.2956L33.7146 24.2928C34.5695 25.7694 36.4582 26.2755 37.9369 25.4242C39.4112 24.5682 39.9134 22.6797 39.0589 21.2045C38.2045 19.7292 36.3164 19.2251 34.8403 20.0781Z"
          />
        </svg>
        <c-typography component="h2" variant="h6" style="margin: 1px 0 0 7px;">
          Newsly
        </c-typography>
      </template>
      <template v-slot:content-right>
        <c-icon-button @click="signOut" style="fill: #ffffff;">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z"
            />
          </svg>
        </c-icon-button>
      </template>
    </c-header-bar>
    <main class="content">
      <div v-if="isLoading" style="height: 200px; width: 100%;">Loading...</div>
      <div v-else class="list">
        <c-card
          v-for="label in labels"
          component="router-link"
          :key="label.id"
          :title="formatLabel(label.name)"
          :to="{ name: 'Label', params: { labelId: label.id } }"
        />
      </div>
    </main>
  </div>
</template>

<script>
  import CIconButton from '@/components/CIconButton';
  import CCard from '../components/CCard.vue';
  import CHeaderBar from '@/components/CHeaderBar';
  import CTypography from '../components/CTypography.vue';

  export default {
    name: 'Home',
    components: {
      CIconButton,
      CHeaderBar,
      CTypography,
      CCard,
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
        console.log(this.$store.getters.getAllLabels);
        return this.$store.getters.getAllLabels;
      },
    },
    methods: {
      formatLabel(label) {
        const capitalizeFirstLetter = ([first, ...rest]) => {
          return `${first.toUpperCase()}${rest.join('')}`;
        };
        return capitalizeFirstLetter(label);
      },
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
