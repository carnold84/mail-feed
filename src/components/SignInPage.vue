<template>
  <div>
    <button @click="$emit('sign-in')">Sign In</button>
  </div>
</template>

<script>
  export default {
    name: 'SignIn',
  };
</script>
