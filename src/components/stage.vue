<template>
  <div class="stage" v-bind:style="{ width: width + 'px' }">
    <div class="level" v-for="level in levels"
                v-bind:style="{ width: (width / levels - 2) + 'px' }">
    </div>
    <div class="value" v-if="value"
                v-for="level in valueCount"
                v-bind:style="{ width: computeValueWidth(level) + 'px',
                          left: (level - 1) * (computeValueWidth(level - 1) + 2) + 'px'}">
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
export default {
  props: ['levels', 'value', 'width'],
	computed: {
		valueCount: function() { // Count how much lines we need
			if (this.value != null)
				return Math.ceil((this.value / 100) / (1 / this.levels));
			else
				return 0;
		}
	},
	methods: {
		computeValueWidth: function(level) { // Impossible math stuff
			if (level == this.valueCount) { // Count width of the last line
				var rest = this.value - (100 / this.levels) * (this.valueCount - 1);

				return rest / 100 * this.width - 2;
			} else {
				return (this.width / this.levels) - 2;
			}
		}
	},
	created: function() {
		this.$nextTick(function() { // Hacks hacks hacks
			if (this.width === 0)
				this.width = this.$vnode.elm.parentNode.offsetWidth - 20; // Hard-coded
		});
	}
}
</script>

