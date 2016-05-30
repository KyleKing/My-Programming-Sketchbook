module.exports = function(exphbs) {
	return exphbs.create({
		helpers: {
			foo: function () {
				return 'FOO!';
			}
		}
	});
};
