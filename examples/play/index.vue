<template>
  <div>
    <test></test>
    <hr>
    <old></old>
  </div>
</template>

<script>
  import Test from './test.vue';
  import Old from './old.vue';
  export default {
    components: {Test, Old}
  };
</script>