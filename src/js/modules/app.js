module.exports = App;

var $ = require('jquery');
var Grid = require('./grid');


/**
 * App
 */
function App() {
	if (!(this instanceof App)) {
        return new App();
    }	

    this.initModules();
}


App.prototype = {

	/**
	 * App.initModules
	 */
	initModules: function() {
		console.info('App.initModules');

		new Grid('.js-grid', {
			datas: logos,
		});
	}
};
