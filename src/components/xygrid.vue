<template>
  <div class="xygrid">
    <div class="top">{{ top }}</div>
    <div class="grid">
      <div class="point" v-bind:style="{ left: realX + 'px', top: realY + 'px' }"></div>
    </div>
    <div class="bottom">{{ bottom }}</div>
    <div class="r">
      <div class="left">{{ left }}</div>
    </div>
    <div class="l">
      <div class="right">{{ right }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
		x: Number,
		y: Number,
		left: {
			type: String,
			default: 'Left'
		},
		right: {
			type: String,
			default: 'Right'
		},
		top: {
			type: String,
			default: 'Top'
		},
		bottom: {
			type: String,
			default: 'Bottom'
		}
	},
	computed: {
		realX: function() {
			return 130 * this.x; // TODO: fix grid
		},
		realY: function() {
			return 130 * this.y;
		}
	}
}
</script>

