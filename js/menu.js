/*
	--- GTA V POPUP MENU ---
*/

function PopupMenu(t, s, i, l) {
	this.title = t || '';
	this.subtitle = s || '&nbsp;';
	this.limit = l || 7;
	this.items = i;
	this.stats = null;
	this.slider = null;
	this.colorPicker = null;
	this.grid = null;
	this.style = 'blue';

	this.index = 0;

	this.currentItem = function() {
		return this.items[this.index];
	};

	this.getStatByIndex = function(index) {
		return this.stats[index];
	}

	this.getStatByName = function(name) {
		this.stats.forEach(function(o) {
			if (o.name === name)
				return o;
		});

		return null;
	}

	this.setSliderValue = function(val) {
		if (this.slider)
			this.slider.value = val;
	}

	this.nextColorItem = function() {
		this.colorPicker.index++;

		if (this.colorPicker.index > this.colorPicker.colors.length - 1) {
			this.colorPicker.index = 0;
		}
	}

	this.prevColorItem = function() {
		this.colorPicker.index--;

		if (this.colorPicker.index < 0) {
			this.colorPicker.index = this.colorPicker.colors.length - 1;
		}
	}

	this.setGridXY = function(x, y) {
		this.grid.x = x;
		this.grid.y = y;
	}

	this.getGridXY = function() {
		return {
			x: this.grid.x,
			y: this.grid.y
		};
	}

	this.nextSelectionItem = function() {
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

	this.prevSelectionItem = function() {
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


	this.Stats = function(stats) {
		this.stats = stats;

		return this;
	}

	this.Slider = function(name, units, value) {
		this.slider = {
			name: name || '&nbsp;',
			units: units || '%',
			value: value || 0
		};

		return this;
	}

	this.ColorPicker = function(name, colors) {
		this.colorPicker = {
			name: name,
			colors: colors,
			index: 0
		};

		return this;
	}

	this.XYGrid = function(x, y, top, bottom, left, right) {
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

	this.Style = function(style) {
		this.style = style || '';

		return this;
	}
}

function MenuItem(name, value, help) {
	return {
		key:   name,
		value: value || null,
		help:  help || null,
		submenu: null,
		style:   null,
		action:  null,
		visible: true,
		index: 0,
		onChange: null,

		Click: function(callback) {
			this.action = callback;

			return this;
		},

		Back: function() {
			this.submenu = true;

			return this;
		},

		SelectionChanged: function(callback) {
			this.onChange = callback;

			return this;
		},

		Style: function(style) {
			this.style = style;

			return this;
		},

		Submenu: function(menu) {
			this.submenu = menu;

			return this;
		}
	};
}

function MenuStatItem(n, v, l, w) {
	return {
		name:   n || '',
		value:  v || 0,
		levels: l || 1,
		width:  w || 160
	};
}

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
			return 130 * this.x;
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
				return (this.width / this.levels) - 2; // Easy
			}
		}
	},
	created: function() {
		this.$nextTick(function() { // Hacks hacks hacks
			if (this.width === 0)
				this.width = this.$vnode.elm.parentNode.offsetWidth - 20;
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
			this.currentMenu.index = index;

			if (this.currentMenu.currentItem().submenu) {
				if (this.currentMenu.currentItem().submenu === true) {
					this.returnBack();
				} else {
					this.menuStack.push(this.currentMenu);
					this.currentMenu = this.currentMenu.currentItem().submenu;
					this.currentMenu.index = 0;
				}
			} else {
				if (this.currentMenu.currentItem().action !== null
					&& (typeof this.currentMenu.currentItem().action) == 'function' ) {
					this.currentMenu.currentItem().action();
				}
			}
		},
		returnBack : function() {
			if (this.menuStack.length > 0)
				this.currentMenu = this.menuStack.pop();
		}
	},
	created: function() {

		var self = this;
		var limit = this.currentMenu.limit > this.currentMenu.items.length ? this.currentMenu.items.length : this.currentMenu.limit;

		if (this.currentMenu.items.length > limit) {
			for (var i = limit; i < this.currentMenu.items.length; i++)
				this.currentMenu.items[i].visible = false;
		}

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

			grid.addEventListener('mousedown', function(e) { // Testing. Remove in production
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

			window.addEventListener('mouseup', function(e) {
				if (e.which === 1) { // LMB
					clicked = false;
				}
			});

			grid.addEventListener('mousemove', function(e) {
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

			if (val > (this.currentMenu.items.length - 1)) {

				for (var i = 0; i < this.currentMenu.items.length; i++) { // Maybe it possible without loop and additional bindngs
					if (i >= this.currentMenu.limit) {
						this.currentMenu.items[i].visible = false;
					} else {
						this.currentMenu.items[i].visible = true;
					}
				}

				this.currentMenu.index = 0;

				return;

			} else if (val < 0) {

				for (var i = 0; i < this.currentMenu.items.length; i++) {
					if (this.currentMenu.items.length - i > this.currentMenu.limit) {
						this.currentMenu.items[i].visible = false;
					} else {
						this.currentMenu.items[i].visible = true;
					}
				}

				this.currentMenu.index = this.currentMenu.items.length - 1;

				return;
			}

			if (val > (this.currentMenu.limit - 1)) {
				this.currentMenu.items[val - this.currentMenu.limit].visible = false;
			} else if ((this.currentMenu.items.length - val) > this.currentMenu.limit) {
				this.currentMenu.items[val + this.currentMenu.limit].visible = false;
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
