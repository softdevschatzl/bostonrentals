<template>
  <div class="container">
    <VueMultiselect
      v-model="multiValue"
      class="multiselect"
      :options="options"
      :multiple="true"
      :close-on-select="false"
      :placeholder="placeholder"
      label="name"
      track-by="name">
    </VueMultiselect>
  </div>
</template>

<script>
import VueMultiselect from 'vue-multiselect'

export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Select...'
    },
  },
  data() {
    return {
      multiValue: []
    }
  },
  components: {
    VueMultiselect
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css">
div {
  width: 100%;
}
</style>