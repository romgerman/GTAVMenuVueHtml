/* ------------------------------------------------------------
---------------------- GTA V POPUP MENU -----------------------
---------------------------------------------------------------
Original Repo: https://github.com/romgerman/GTAVMenuVueHtml
------------------------------------------------------------ */

class PopupMenu {

	/**
	 *
	 * @param {string} title
	 * @param {string} subtitle
	 * @param {MenuItem[]} items
	 * @param {Number} limit
	 */
	constructor(title, subtitle, items, limit) {
		this.title = title || '';
		this.subtitle = subtitle || '&nbsp;';
		this.limit = limit || 7;
		this.items = items;
		this.stats = null;
		this.slider = null;
		this.colorPicker = null;
		this.grid = null;
		this.style = 'blue';
		this.onItemChange = null;

		this.index = 0;
	}

	// methods

	currentItem() {
		return this.items[this.index];
	}

	getStatByIndex(index) {
		return this.stats[index];
	}

	getStatByName(name) {
		this.stats.forEach(function(o) {
			if (o.name === name)
				return o;
		});

		return null;
	}

	setSliderValue(value) {
		if (this.slider)
			this.slider.value = value;
	}

	nextColorItem() {
		this.colorPicker.index++;

		if (this.colorPicker.index > this.colorPicker.colors.length - 1) {
			this.colorPicker.index = 0;
		}
	}

	prevColorItem() {
		this.colorPicker.index--;

		if (this.colorPicker.index < 0) {
			this.colorPicker.index = this.colorPicker.colors.length - 1;
		}
	}

	setGridXY(x, y) {
		this.grid.x = x;
		this.grid.y = y;
	}

	getGridXY() {
		return {
			x: this.grid.x,
			y: this.grid.y
		};
	}

	nextSelectionItem() {
		var item = this.currentItem();

		if (Object.prototype.toString.call(item.value) !== '[object Array]')
			return;

		item.index++;

		if (item.index > item.value.length - 1) {
			item.index = 0;
		}

		if ((typeof item.onChange) === 'function') {
			item.onChange(item.index, item.value[item.index]);
		}
	}

	prevSelectionItem() {
		var item = this.currentItem();

		if (Object.prototype.toString.call(item.value) !== '[object Array]')
			return;

		item.index--;

		if (item.index < 0) {
			item.index = item.value.length - 1;
		}

		if ((typeof item.onChange) === 'function') {
			item.onChange(item.index, item.value[item.index]);
		}
	}

	// modular methods

	Stats(stats) {
		this.stats = stats;
		return this;
	}

	Slider(name, units, value) {
		this.slider = {
			name: name || '&nbsp;',
			units: units || '%',
			value: value || 0
		};

		return this;
	}

	ColorPicker(name, colors) {
		this.colorPicker = {
			name: name,
			colors: colors,
			index: 0
		};

		return this;
	}

	XYGrid(x, y, top, bottom, left, right) {
		this.grid = {
			x: x || 0,
			y: y || 0,
			top: top,
			bottom: bottom,
			left: left,
			right: right
		};

		return this;
	}

	Style(style) {
		this.style = style || '';

		return this;
	}

	ActiveItemChanged(callback) {
		this.onItemChange = callback;

		return this;
	}
}

class MenuItem {

	/**
	 *
	 * @param {string} name
	 * @param {string|string[]} value
	 * @param {string} help
	 */
	constructor(name, value, help) {
		this.key   = name;
		this.value = value || null;
		this.help  =  help || null;
		this.submenu  = null;
		this.style    = null;
		this.action   = null;
		this.visible  = true;
		this.index    = 0;
		this.onChange = null;
	}

	Click(callback) {
		this.action = callback;

		return this;
	}

	Back() {
		this.submenu = true;

		return this;
	}

	SelectionChanged(callback) {
		this.onChange = callback;

		return this;
	}

	Style(style) {
		this.style = style;

		return this;
	}

	Submenu(menu) {
		this.submenu = menu;

		return this;
	}
}

class MenuStatItem {

	/**
	 *
	 * @param {string} name
	 * @param {Number} value
	 * @param {Number} levels
	 * @param {Number} width
	 */
	constructor(name, value, levels, width) {
		this.name = name || '';
		this.value = value || 0;
		this.levels = levels || 1;
		this.width = width || 160;
	}
}

// VUE COMPONENTS

Vue.component('selection', {
	template: '#selection',
	props: {
		index: {
			type: Number,
			default: 0
		},
		list: Array
	}
});

Vue.component('slider', {
	template: '#slider',
	props: {
		name: String,
		units: String,
		value: {
			type: Number,
			default: 0
		}
	}
});

Vue.component('color-selector', {
	template: '#color-selector',
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
});

Vue.component('xygrid', {
	template: '#xygrid',
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
});

Vue.component('stage', {
	props: ['levels', 'value', 'width'],
	template: '#stage',
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
});

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

Vue.component('popup-menu', {
	template: '#popup-menu',
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
					this.currentMenu.currentItem().action();
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

			if (e.keyCode == 38) { // up
				self.currentMenu.index--;
			} else if (e.keyCode == 40) { // down
				self.currentMenu.index++;
			} else if (e.keyCode == 13) { // enter
				self.processClick(self.currentMenu.index);
			} else if (e.keyCode == 8) { // backspace
				self.returnBack();
			}

			if (self.currentMenu.currentItem() != null) {
				if (e.keyCode == 37) { // left
					self.currentMenu.prevSelectionItem();
				} else if (e.keyCode == 39) { // right
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
	}
});
