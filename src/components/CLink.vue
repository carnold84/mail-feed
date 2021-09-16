<template>
  <c-typography
    :component="component"
    :class="['c_link', { is_inverted: isInverted }]"
    :href="href"
    :to="to"
    :variant="variant"
  >
    <slot></slot>
  </c-typography>
</template>

<script>
  import CTypography from '@/components/CTypography.vue';

  export default {
    components: { CTypography },
    name: 'CLink',
    props: {
      component: {
        default() {
          return 'a';
        },
        type: String,
      },
      href: {
        default: undefined,
        type: String,
      },
      isInverted: {
        default() {
          return false;
        },
        type: Boolean,
      },
      to: {
        default: undefined,
        type: [Object, String],
      },
      variant: {
        type: String,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .c_link {
    border-bottom: var(--primary) dotted 1px;
    color: var(--primary);
    display: inline;
    font-weight: normal;
    font-style: normal;
    margin: 0;
    padding: 0 0 2px;
    text-decoration: none;

    &.is_inverted {
      color: #ffffff;
      border-bottom: #ffffff dotted 1px;
    }

    &:hover {
      border-bottom: var(--secondary) dotted 1px;
      color: var(--secondary);
    }
  }
</style>
