var subSubMenuInfo = new PopupMenu('Subsub menu', null, [
	MenuItem('There we go').Click(function() { alert("Clicked"); }),
	MenuItem('Currently backspace and no RMB stuff').Back()
]);

var submenuInfo = new PopupMenu('Submenu title', 'subtitle', [
	MenuItem('Something', 'LUL'),
	MenuItem('Computer', 'yeyyeye'),
	MenuItem('Ayyy', 'lmao'),
	MenuItem('Nice text', 'actually'),
	MenuItem('Buy', 'my pants'),
	MenuItem('Send', 'nudes').Submenu(subSubMenuInfo),
	MenuItem('Return by pressing this', null, 'Or by pressing Backspace key or RMB button').Back(),
]).Style(null);

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

var app = new Vue({
	el: '#container',
	data: {
		menu: menuInfo
	}
});
