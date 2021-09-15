<template>
  <component
    :is="component"
    :class="['c_button', { is_primary: isPrimary, is_round: isRound }]"
    :to="to"
  >
    <slot></slot>
  </component>
</template>

<script>
  export default {
    name: 'CButton',
    props: {
      component: {
        default() {
          return 'button';
        },
        type: String,
      },
      isButton: {
        default: true,
        type: Boolean,
      },
      isPrimary: {
        default: false,
        type: Boolean,
      },
      isRound: {
        default: false,
        type: Boolean,
      },
      to: {
        default: undefined,
        type: [Object, String],
      },
    },
  };
</script>

<style lang="scss" scoped>
  .c_button {
    align-items: center;
    background-color: var(--button-bg-color);
    border: var(--button-border-color) solid 1px;
    border-radius: 3px;
    box-shadow: rgba(0, 0, 0, 0.15) 0 1px 1px;
    color: var(--font-color-secondary);
    cursor: pointer;
    display: inline-flex;
    fill: var(--font-color-secondary);
    font-family: var(--font-family-primary);
    font-size: 14px;
    height: 34px;
    justify-content: center;
    line-height: 17px;
    padding: 0 12px;

    &:hover {
      background-color: var(--button-bg-color__HOVER);
      border: var(--button-border-color__HOVER) solid 1px;
      box-shadow: rgba(0, 0, 0, 0.25) 0 1px 3px;
      color: var(--font-color-primary);
      fill: var(--font-color-primary);
    }

    &.is_primary {
      background-color: var(--button-primary-bg-color);
      border: var(--button-primary-border-color) solid 1px;
      box-shadow: rgba(0, 0, 0, 0.35) 0 1px 2px;
      color: rgba(255, 255, 255, 1);
      fill: rgba(255, 255, 255, 1);

      &:hover {
        background-color: var(--button-primary-bg-color__HOVER);
        border: var(--button-primary-border-color__HOVER) solid 1px;
        box-shadow: rgba(0, 0, 0, 0.55) 0 1px 4px;
      }
    }

    &.is_round {
      border-radius: 20px;
      height: 30px;
      padding: 0;
      width: 30px;
    }
  }
</style>
