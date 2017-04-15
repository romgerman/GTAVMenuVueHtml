
// TEST DATA

var subSubMenuInfo = new PopupMenu('Subsub menu', null, [
	MenuItem('There we go').Click(function() { alert("Clicked"); }),
	MenuItem('Currently no backspace and RMB stuff').Back()
]);

var submenuInfo = new PopupMenu('Submenu title', 'subtitle', [
	MenuItem('Something', 'LUL'),
	MenuItem('Computer', 'yeyyeye'),
	MenuItem('Ayyy', 'lmao'),
	MenuItem('Nice text', 'actually'),
	MenuItem('Buy', 'my pants'),
	MenuItem('Send', 'nudes').Submenu(subSubMenuInfo),
	MenuItem('Return by pressing this', null, 'Or by pressing Backspace key or RMB button').Back(),
]);

var menuInfo = new PopupMenu('Vinewood Hills, 234', 'buy house', [
	MenuItem('Cost', '$10000'),
	MenuItem('Rooms', 3),
	MenuItem('Sleeping places', 1, 'Determines how many people can live in this house'),
	MenuItem('Select style', ['Modern', 'Victorian', 'Vagabond']).SelectionChanged(function(index, name) { console.log(index + ': ' + name); }),
	MenuItem('Owner', '<img style="margin: -5px -5px 0 0" src="img/429.png" />'),
	MenuItem('Buy').Style('green button').Submenu(submenuInfo),
	MenuItem('Sell').Style('red button'),
	MenuItem('Close menu').Style('gray'),
], 5).Stats([
	MenuStatItem('Engine speed what', 25, 5),
	MenuStatItem('This', 50)
]).Slider('Opacity', null, 50).ColorPicker('Colors', [
	'40BAE3', '6840E3', '30BF7F', '9FF23A',
	'3AF2EF', 'F2713A', 'F2463A', 'F2F07E',
	'F255AE', '999095', '40BAE3', '6840E3',
	'30BF7F', '9FF23A', '3AF2EF', 'F2713A',
	'F2463A', 'F2F07E', 'F255AE', '999095',
]).XYGrid(0, 0);

// MENU STUFF

function PopupMenu(t, s, i, l) {
	this.title = t || '';
	this.subtitle = s || '&nbsp;';
	this.limit = l || 7;
	this.items = i;
	this.stats = null;
	this.slider = null;
	this.colorPicker = null;
	this.grid = null;

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

Vue.component('colors', {
	template: '#colors',
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

var vue = new Vue({
	el: '.popup-menu',
	data: {
		menu: menuInfo,
		menuStack: [],
		help: null
	},
	methods: {
		processClick: function(index) { // Weird but works
			this.menu.index = index;

			if (this.menu.currentItem().submenu) {
				if (this.menu.currentItem().submenu === true && this.menuStack.length > 0) {
					this.menu = this.menuStack.pop();
				} else {
					this.menuStack.push(this.menu);
					this.menu = this.menu.currentItem().submenu;
					this.menu.index = 0;
				}
			} else {
				if (this.menu.currentItem().action !== null
					&& (typeof this.menu.currentItem().action) == 'function' ) {
					this.menu.currentItem().action();
				}
			}
		},
		selectionItemNext() {
			var item = this.menu.currentItem();

			item.index++;

			if (item.index > item.value.length - 1) {
				item.index = 0;
			}

			if (item.onChange) {
				item.onChange(item.index, item.value[item.index]);
			}
		},
		selectionItemPrev(item) {
			var item = this.menu.currentItem();

			item.index--;

			if (item.index < 0) {
				item.index = item.value.length - 1;
			}

			if (item.onChange) {
				item.onChange(item.index, item.value[item.index]);
			}
		}
	},
	created: function() {

		var limit = this.menu.limit > this.menu.items.length ? this.menu.items.length : this.menu.limit;

		if (this.menu.items.length > limit) {
			for (var i = limit; i < this.menu.items.length; i++)
				this.menu.items[i].visible = false;
		}

		window.addEventListener('wheel', function(e) { // Testing. Remove in production
			var delta = e.deltaY || e.detail || e.wheelData;

			if (delta > 0) {
				vue.menu.index++;
			} else if(delta < 0) {
				vue.menu.index--;
			}
		});

		var self = this;

		this.$nextTick(function() { // WARNING: Hardcoded
			var grid = this._vnode.elm.getElementsByClassName('xygrid')[0].children[1];
			var clicked = false;

			grid.addEventListener('mousedown', function(e) { // Testing. Remove in production
				if (e.which === 1) { // LMB
					var pos = getElementPosition(e.currentTarget);

					var x = e.clientX - pos.x;
					var y = e.clientY - pos.y;

					if (self.menu.grid && (x < 136 && y < 136)) {
						self.menu.setGridXY(x / 130, y / 130);
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

					if (self.menu.grid && (x < 136 && y < 136)) {
						self.menu.setGridXY(x / 130, y / 130);
					}
				}
			});
		});

		window.addEventListener('keyup', function(e) { // Testing. Remove in production
			if (e.keyCode == 38) { // up
				vue.menu.index--;
			} else if (e.keyCode == 40) { // down
				vue.menu.index++;
			} else if (e.keyCode == 13) { // enter
				vue.processClick(vue.menu.index);
			}

			if (vue.menu.currentItem() != null && vue.menu.currentItem().index != null) {
				if (e.keyCode == 37) { // left
					vue.selectionItemPrev();
					vue.menu.stats[0].value--;
				} else if (e.keyCode == 39) { // right
					vue.selectionItemNext();
					vue.menu.stats[0].value++;
				}
			}

			if (vue.menu.colorPicker)
			{
				if (e.keyCode == 37) { // left
					vue.menu.prevColorItem();
				} else if (e.keyCode == 39) { // right
					vue.menu.nextColorItem();
				}
			}

			return false;
		});
	},
	watch: {
		'menu.index': function(val, old) { // Change selected item depending on current index

			if (val > (this.menu.items.length - 1)) {

				for (var i = 0; i < this.menu.items.length; i++) { // Maybe it possible without loop and additional bindngs
					if (i >= this.menu.limit) {
						this.menu.items[i].visible = false;
					} else {
						this.menu.items[i].visible = true;
					}
				}

				this.menu.index = 0;

				return;

			} else if (val < 0) {

				for (var i = 0; i < this.menu.items.length; i++) {
					if (this.menu.items.length - i > this.menu.limit) {
						this.menu.items[i].visible = false;
					} else {
						this.menu.items[i].visible = true;
					}
				}

				this.menu.index = this.menu.items.length - 1;

				return;
			}

			if (val > (this.menu.limit - 1)) {
				this.menu.items[val - this.menu.limit].visible = false;
			} else if ((this.menu.items.length - val) > this.menu.limit) {
				this.menu.items[val + this.menu.limit].visible = false;
			}

			this.menu.items[val].visible = true;

			if (this.menu.items[val].help) {
				this.help = this.menu.items[val].help;
			} else {
				this.help = null;
			}
		}
	}
});
