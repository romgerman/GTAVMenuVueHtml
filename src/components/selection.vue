<template>
  <ul class="selection">
    <li v-for="(item, ind) in list" v-bind:class="{ active: index === ind }">
			{{ item }}
		</li>
  </ul>
</template>

<script>
export default {
  props: {
		index: {
			type: Number,
			default: 0
		},
		list: Array
	}
}
</script>

