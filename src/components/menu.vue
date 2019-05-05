<template>
  <div class="popup-menu" v-if="menu">
    <div v-bind:class="[ 'header', currentMenu.style ]">
      <h1>{{ currentMenu.title }}</h1>
      <h3>
        <span v-html="currentMenu.subtitle"></span>
        <span class="right">{{ currentMenu.index + 1 }} / {{ currentMenu.items.length }}</span>
      </h3>
      <div class="clear"></div>
    </div>

    <ul>
      <li v-for="(item, index) in currentMenu.items" v-if="item.visible"
                                v-bind:class="[item.style, { active: currentMenu.index == index }]"
                                v-on:click="processClick(index)">
        <div v-if="Object.prototype.toString.call(item.value) !== '[object Array]'">
          <span v-if="item.value">{{ item.key }}</span>
          <span v-if="item.value" v-html="item.value"></span>
          <div v-else>{{ item.key }}</div>
        </div>
        <div v-else>
          <span>{{ item.key }}</span>
          <span><selection v-bind:list="item.value" v-bind:index="item.index"></selection></span>
        </div>
      </li>
    </ul>

    <div class="scroll-line" v-if="currentMenu.items.length > currentMenu.limit"></div>
    <div class="help" v-if="help"><p>{{ help }}</p></div>
    <div v-if="currentMenu.slider">
      <slider v-bind:name="currentMenu.slider.name"
          v-bind:units="currentMenu.slider.units"
          v-bind:value="currentMenu.slider.value"></slider>
    </div>
    <div v-if="currentMenu.colorPicker">
      <color-selector v-bind:name="currentMenu.colorPicker.name"
              v-bind:colors="currentMenu.colorPicker.colors"
              v-bind:index="currentMenu.colorPicker.index"></color-selector>
    </div>
    <div v-if="currentMenu.grid">
      <xygrid v-bind:x="currentMenu.grid.x"
          v-bind:y="currentMenu.grid.y"
          v-bind:top="currentMenu.grid.top"
          v-bind:bottom="currentMenu.grid.bottom"
          v-bind:left="currentMenu.grid.left"
          v-bind:right="currentMenu.grid.right"></xygrid>
    </div>

    <div class="stats" v-if="currentMenu.stats">
      <div v-for="item in currentMenu.stats">
        <span>{{ item.name }}</span>
        <stage v-bind:levels="item.levels"
              v-bind:value="item.value"
              v-bind:width="item.width">
        </stage>
      </div>
    </div>
  </div>
</template>

<script>
import ColorComponent from './color.vue'
import SelectionComponent from './selection.vue'
import StageComponent from './stage.vue'
import XYGridComponent from './xygrid.vue'
import ProgressComponent from './progress.vue'

// https://www.kirupa.com/snippets/move_element_to_click_position.htm
function getElementPosition(el) {
	var xPos = 0;
	var yPos = 0;

	while (el) {
		if (el.tagName == "BODY") {
			// deal with browser quirks with body/window/document and page scroll
			var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
			var yScroll = el.scrollTop || document.documentElement.scrollTop;

			xPos += (el.offsetLeft - xScroll + el.clientLeft);
			yPos += (el.offsetTop - yScroll + el.clientTop);
		} else {
			// for all other non-BODY elements
			xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
			yPos += (el.offsetTop - el.scrollTop + el.clientTop);
		}

		el = el.offsetParent;
	}

	return {
		x: xPos,
		y: yPos
	};
}

let KeyCode = {
	Up: 38,
	Down: 40,
	Left: 37,
	Right: 39,
	Enter: 13,
	Backspace: 8
}

export default {
  props: {
		menu: Object
	},
	data: function() {
		return {
			currentMenu: this.menu,
			menuStack: [],
			help: null
		};
	},
	methods: {
		processClick: function(index) {
			// To trigger click event we should click 2 times (like in GTA, according to @rt-2)
			if (this.currentMenu.index !== index) {
				this.currentMenu.index = index;
				return;
			}

			if (this.currentMenu.currentItem().submenu) {
				if (this.currentMenu.currentItem().submenu === true) {
					this.returnBack();
				} else {
					this.menuStack.push(this.currentMenu);
					this.currentMenu = this.currentMenu.currentItem().submenu;
					this.currentMenu.index = 0;
					this.calculateLimit();
				}
			} else {
				if ((typeof this.currentMenu.currentItem().action) == 'function') {
					this.currentMenu.currentItem().action(index);
				}
			}
		},
		returnBack : function() {
			if (this.menuStack.length > 0)
				this.currentMenu = this.menuStack.pop();
		},
		calculateLimit: function() {
			// Just to be sure
			var limit = this.currentMenu.limit > this.currentMenu.items.length ? this.currentMenu.items.length : this.currentMenu.limit;

			if (this.currentMenu.items.length > limit) {
				for (var i = 0; i < this.currentMenu.items.length; i++) {
					this.currentMenu.items[i].visible = (i < limit);
				}
			}
		}
	},
	created: function() {

		var self = this;
		this.calculateLimit();

		window.addEventListener('wheel', function(e) {
			var delta = e.deltaY || e.detail || e.wheelData;

			if (delta > 0) {
				self.currentMenu.index++;
			} else if(delta < 0) {
				self.currentMenu.index--;
			}
		});

		this.$nextTick(function() { // WARNING: Hardcoded

			if (this.$vnode.elm.getElementsByClassName('xygrid').length === 0)
				return;

			var grid = this.$vnode.elm.getElementsByClassName('xygrid')[0].children[1];
			var clicked = false;

			grid.addEventListener('mousedown', function(e) { // Mouse event for xygrid
				if (e.which === 1) { // LMB
					var pos = getElementPosition(e.currentTarget);

					var x = e.clientX - pos.x;
					var y = e.clientY - pos.y;

					if (self.currentMenu.grid && (x < 136 && y < 136)) {
						self.currentMenu.setGridXY(x / 130, y / 130);
					}

					clicked = true;
				}
			});

			window.addEventListener('mouseup', function(e) { // Mouse event for xygrid
				if (e.which === 1) { // LMB
					clicked = false;
				}
			});

			grid.addEventListener('mousemove', function(e) { // Mouse event for xygrid
				if (clicked) {
					var pos = getElementPosition(e.currentTarget);

					var x = e.clientX - pos.x;
					var y = e.clientY - pos.y;

					if (self.currentMenu.grid && (x < 136 && y < 136)) {
						self.currentMenu.setGridXY(x / 130, y / 130);
					}
				}
			});
		});

		window.addEventListener('contextmenu', function (e) { // Right-click
		    e.preventDefault();
		    self.returnBack();
		});

		window.addEventListener('keyup', function(e) {

			if (e.keyCode == KeyCode.Up) {
				self.currentMenu.index--;
			} else if (e.keyCode == KeyCode.Down) {
				self.currentMenu.index++;
			} else if (e.keyCode == KeyCode.Enter) {
				self.processClick(self.currentMenu.index);
			} else if (e.keyCode == KeyCode.Backspace) {
				self.returnBack();
			}

			if (self.currentMenu.currentItem() != null) {
				if (e.keyCode == KeyCode.Left) {
					self.currentMenu.prevSelectionItem();
				} else if (e.keyCode == KeyCode.Right) {
					self.currentMenu.nextSelectionItem();
				}
			}

			if (self.currentMenu.colorPicker) // Testing. Remove in production
			{
				if (e.keyCode == 37) { // left
					self.currentMenu.prevColorItem();
				} else if (e.keyCode == 39) { // right
					self.currentMenu.nextColorItem();
				}
			}

			return false;
		});
	},
	watch: {
		'currentMenu.index': function(val, old) { // Change selected item depending on current index

			if (val > (this.currentMenu.items.length - 1)) { // When more than length
				for (var i = 0; i < this.currentMenu.items.length; i++) {
					this.currentMenu.items[i].visible = (i < this.currentMenu.limit);
				}

				this.currentMenu.index = 0;

				return;

			} else if (val < 0) { // When less than 0
				for (var i = 0; i < this.currentMenu.items.length; i++) {
						this.currentMenu.items[i].visible = (this.currentMenu.items.length - i <= this.currentMenu.limit);
				}

				this.currentMenu.index = this.currentMenu.items.length - 1;

				return;
			}

			if ((typeof this.currentMenu.onItemChange) === 'function') {
				this.currentMenu.onItemChange(this.currentMenu.index);
			}

			if (val > (this.currentMenu.limit - 1)) {
				this.currentMenu.items[val - this.currentMenu.limit].visible = false;
			} else if ((this.currentMenu.items.length - val) > this.currentMenu.limit) {
				this.currentMenu.items[val + this.currentMenu.limit].visible = false;
			}

			if (val < old && (!this.currentMenu.items[val].visible)) { // Scrolling to top above visible item
				this.currentMenu.items[old + this.currentMenu.limit - 1].visible = false;
			}

			this.currentMenu.items[val].visible = true;

			if (this.currentMenu.items[val].help) {
				this.help = this.currentMenu.items[val].help;
			} else {
				this.help = null;
			}
		}
  },
  components: {
    'stage': StageComponent,
    'xygrid': XYGridComponent,
    'color-selector': ColorComponent,
    'slider': ProgressComponent,
    'selection': SelectionComponent
  }
}
</script>

