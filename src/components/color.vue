<template>
  <div class="colors">
    <div class="title">Colors ({{ (index + 1) + ' / ' + colors.length }})</div>
    <ul>
      <li v-for="(color, ind) in colors" v-if="isShowing(ind)"
                          v-bind:style="{ background: '#' + color }"
                          v-bind:class="{ active: index === ind }"></li>
    </ul>
    <div class="clear"></div>
  </div>
</template>

<script>
export default {
  props: {
		name: String,
		colors: Array,
		index: {
			type: Number,
			default: 0
		}
	},
	methods: {
		isShowing: function(val) {
			if (this.index > 7) {
				var r = this.index - 7;

				if (val < r) {
					return false;
				}

				if (val > this.index) {
					return false;
				}
			} else {
				if (val > 7) {
					return false;
				}
			}

			return true;
		}
	}
}
</script>

