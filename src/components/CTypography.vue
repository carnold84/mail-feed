<template>
  <component :is="component" :class="['c_typography', variant]">
    <slot />
  </component>
</template>

<script>
  export default {
    name: 'CTypography',
    props: {
      component: {
        default() {
          return 'p';
        },
        type: [Object, String],
      },
      variant: {
        default() {
          return 'p';
        },
        type: String,
        validator(value) {
          return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(value);
        },
      },
    },
  };
</script>

<style scoped>
  .c_typography {
    color: var(--text1);
    font-weight: 400;
    margin: 0 0 15px;
  }

  .c_typography.h1 {
    font-size: 3.2rem;
    line-height: 4.2rem;
  }

  .c_typography.h2 {
    font-size: 2.9rem;
    line-height: 3.9rem;
  }

  .c_typography.h3 {
    font-size: 2.6rem;
    line-height: 3.6rem;
  }

  .c_typography.h4 {
    font-size: 2.3rem;
    line-height: 3.3rem;
  }

  .c_typography.h5 {
    font-size: 2rem;
    line-height: 3rem;
  }

  .c_typography.h6 {
    font-size: 1.7rem;
    line-height: 2.7rem;
  }

  .c_typography.p {
    font-size: 1.4rem;
    line-height: 2.4rem;
  }
</style>
