
function PopupMenu(t, s, i, l) {
	this.title = t || '';
	this.subtitle = s || '&nbsp;';
	this.limit = l || 7;
	this.index = 0;
	this.items = i;

	this.currentItem = function() {
		return this.items[this.index];
	};
}

function MenuItem(k, v, s, h, m, c) {
	return {
		key:   k,
		value: v,
		style: s || '',
		help:  h || null,
		submenu: m || null,
		action: c || null,
		visible: true
	};
}

function MenuSelectionItem(k, v, s, h, i, c) {
	return {
		key:   k,
		value: v,
		style: s || '',
		help:  h || null,
		index: i || 0,
		onChange: c || null,
		visible: true
	};
}

var subSubMenuInfo = new PopupMenu('Subsub menu', null, [
	MenuItem('There we go', null, null, null, null, function() { alert("hello boy"); }),
	MenuItem('Currently no backspace and RMB stuff', null, null, null, true)
]);

var submenuInfo = new PopupMenu('Submenu title', 'subtitle', [
	MenuItem('Something', 'LUL'),
	MenuItem('Computer', 'yeyyeye'),
	MenuItem('Ayyy', 'lmao'),
	MenuItem('Nice text', 'actually'),
	MenuItem('Buy', 'my pants'),
	MenuItem('Send', 'nudes', null, null, subSubMenuInfo),
	MenuItem('Return by pressing this', null, null, 'Or by pressing Backspace key or RMB button', true),
]);

var menuInfo = new PopupMenu('Vinewood Hills, 234', 'buy house', [
	MenuItem('Cost', '$10000'),
	MenuItem('Rooms', 3),
	MenuItem('Sleeping places', 1, null, 'Determines how many people can live in this house'),
	MenuSelectionItem('Select style', ['Modern', 'Victorian', 'Vagabond'], null, null, 0, function(index, name) { alert(index + ': ' + name); }),
	MenuItem('Owner', '<img style="margin: -5px -5px 0 0" src="img/429.png" />'),
	MenuItem('Buy', null, 'green button', null, submenuInfo),
	MenuItem('Sell', null, 'red button'),
	MenuItem('Close menu', null, 'gray'),
], 5);

Vue.component('selection', {
	props: {
		index: {
			type: Number,
			default: 0
		},
		list: Array
	},
	template: '#selection'
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
	}
});

var vue = new Vue({
	el: '.popup-menu',
	data: {
		menu: menuInfo,
		menuStack: [],
		help: null,
		stats: [
			{
				name: 'Top Speed',
				levels: 1,
				value: 35,
				width: 160
			},
			{
				name: 'Braking',
				levels: 7,
				value: 76,
				width: 160
			},
			{
				name: 'Traction',
				levels: 5,
				value: 20,
				width: 160
			}
		]
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
		},
		selectionItemPrev(item) {
			var item = this.menu.currentItem();

			item.index--;

			if (item.index < 0) {
				item.index = item.value.length - 1;
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
					vue.stats[0].value--;
				} else if (e.keyCode == 39) { // right
					vue.selectionItemNext();
					vue.stats[0].value++;
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
