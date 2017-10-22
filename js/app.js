var subSubMenuInfo = new PopupMenu('Subsub menu', null, [
	new MenuItem('There we go').Click(function() { alert("Clicked"); }),
	new MenuItem('Currently backspace and no RMB stuff').Back()
]);

var submenuInfo = new PopupMenu('Submenu title', 'subtitle', [
	new MenuItem('Something', 'LUL'),
	new MenuItem('Computer', 'yeyyeye'),
	new MenuItem('Ayyy', 'lmao'),
	new MenuItem('Nice text', 'actually'),
	new MenuItem('Buy', 'my pants'),
	new MenuItem('What what', 'in the butt'),
	new MenuItem('TExt'),
	new MenuItem('More items'),
	new MenuItem('Even more items'),
	new MenuItem('Whoooo'),
	new MenuItem('Send', 'nudes').Submenu(subSubMenuInfo),
	new MenuItem('Return by pressing this', null, 'Or by pressing Backspace key or RMB button').Back(),
]).Style(null);

var menuInfo = new PopupMenu('Vinewood Hills, 234', 'buy house', [
	new MenuItem('Cost', '$10000'),
	new MenuItem('Rooms', 3),
	new MenuItem('Sleeping places', 1, 'Determines how many people can live in this house'),
	new MenuItem('Select style', ['Modern', 'Victorian', 'Vagabond']).SelectionChanged(function(index, name) { console.log(index + ': ' + name); }),
	new MenuItem('Owner', '<img style="margin: -5px -5px 0 0" src="img/429.png" />'),
	new MenuItem('Buy').Style('green button').Submenu(submenuInfo),
	new MenuItem('Sell').Style('red button'),
	new MenuItem('Close menu').Style('gray'),
], 5).Stats([
	new MenuStatItem('Engine speed what', 25, 5),
	new MenuStatItem('This', 50)
]).Slider('Opacity', null, 50).ColorPicker('Colors', [
	'40BAE3', '6840E3', '30BF7F', '9FF23A',
	'3AF2EF', 'F2713A', 'F2463A', 'F2F07E',
	'F255AE', '999095', '40BAE3', '6840E3',
	'30BF7F', '9FF23A', '3AF2EF', 'F2713A',
	'F2463A', 'F2F07E', 'F255AE', '999095',
]).XYGrid(0, 0).ActiveItemChanged(function(index) { console.log(index); });

var app = new Vue({
	el: '#container',
	data: {
		menu: menuInfo
	}
});
