<template>
  <div class="slider">
    <div class="title">
      <span>{{ 0 + '' + units }}</span>
      <span>{{ 100 + '' + units }}</span>
      <span class="name">{{ name }}</span>
      <div class="clear"></div>

    </div>
    <stage v-bind:levels="1" v-bind:value="value" v-bind:width="0"></stage>
  </div>
</template>

<script>
import StageComponent from './stage.vue'

export default {
  props: {
		name: String,
		units: String,
		value: {
			type: Number,
			default: 0
		}
  },
  components: {
    'stage': StageComponent
  }
}
</script>

