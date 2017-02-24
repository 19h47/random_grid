module.exports = Grid;

var $ = require('jquery');


/**
 * Grid
 */
function Grid(element) {
 	if (!(this instanceof Grid)) {
        return new Grid();
    }

    if (!element || !element.length) {
    	return;
    }

    this.element = document.querySelector(element);

    this.array = [].slice.call(this.element.querySelectorAll('.Card'));
    
    // Setup Grid
    this.setup();
}


/**
 * Grid
 */
Grid.prototype = {
	
	/**
	 * Grid.setup
	 */
	setup: function() {
		console.info('Grid.setup');

		var _this = this;

		// First, we shuffle the array
		this.shuffle(this.array);
		
		// Next we construct the grid
		this.init(this.element, this.array);

		// And we load next tile
		this.loadNext();
		
		// Usefull for raf
		this.fps = .5;
		this.now;
		this.then = Date.now();
		this.interval = 1000 / this.fps;
		this.delta;

		this.rafId = requestAnimationFrame(this.draw.bind(this));
		
	},


	/**
	 * Grid.init
	 *
	 * @param DOM element
	 * @param array  	
	 */
	init: function(element, array) {
		console.info('Grid.init');

		// Empty output var
		var output = '';

		// For element in array
		array.forEach(function(entry){

			entry.firstElementChild.classList.add('current');

			output += '<div class="col-xs-4 Card">' + entry.innerHTML + '</div>';

		});

		return element.firstElementChild.innerHTML = output;
	},


	/**
	 * Grid.loadNext
	 */
	loadNext: function() {
		console.info('Grid.loadNext');

		var _this = this;
		

		var elements = [].slice.call(this.element.querySelectorAll('.Card'));
		// console.log(this.array[0]);
		
		var i = 0;
		elements.forEach(function(element) {

			_this.array[i].firstElementChild.classList.remove('current');
			_this.array[i].firstElementChild.classList.add('next');

			elements[i].innerHTML += _this.array[i].innerHTML;

			// console.dir(_this.array[i]);

			i++;
		});
	},


	/**
	 * Grid.draw
	 *
	 * @see  http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/
	 */
	draw: function(timestamp) {
		// console.info('Grid.info');

		this.now = Date.now();
	    this.delta = this.now - this.then;
	     
	    if ( this.delta > this.interval) {
	        
	        this.then = this.now - ( this.delta % this.interval );
	         
	        console.info('Grid.draw');

	        this.incrementArray(this.array);
	        this.destroy($('.current'));
	        this.toggleClass($('.next'), 'next', 'current');
	        this.loadNext();

	        this.fps = this.randomNumber(.1, 1);
	        console.log(this.fps);
	    } 
	    this.rafId = requestAnimationFrame(this.draw.bind(this));   
	},


	/**
	 * Grid.destroy
	 *
	 * @see  http://stackoverflow.com/a/10842519/5091221
	 */
	destroy: function(elementCurrent) {

		return elementCurrent.remove();
	},


	/**
	 * Grid.addClass
	 *
	 * @see  http://stackoverflow.com/a/10842519/5091221
	 */
	toggleClass: function(element, classRemove, classAdd) {

		element.removeClass(classRemove);
		element.addClass(classAdd);
	},


	/**
	 * Grid.getLength
	 * 
	 * @param  	element
	 * @return 	length  	length of given element
	 * @see  	http://stackoverflow.com/a/767492/5091221
	 */
	getLength: function(element) {

		// Test if `element is actually an Array, if not, return
		if(!Array.isArray(element)) {
			console.error('element is not an array');

			return;
		}

		return this.length = element.length;
	},


	/**
	 * Grid.incrementArray
	 *
	 * Pass the first key of a given array in last position
	 *
	 * @param 	array
	 * @return 	array
	 */
	incrementArray: function(array) {
		
		return array.push( array.shift());
	},
	

	/**
	 * Grid.randomNumber
	 *
	 * Return a number between min and max
	 * 
	 * @param 	min 	The start number
	 * @param 	max		The number of possible results ( 1 + start(6) - end(1) )
	 * @return 	number
	 * @see 	http://stackoverflow.com/a/4960020/5091221
	 */
	randomNumber: function(min, max) {
		
		return Math.random() * max + min; 
	},


	/**
	 * Grid.shuffle
	 *
	 * Random Shuffling An Array the Fisher-Yates way
	 *
	 * @param 	array
	 * @return 	array
	 * @see  	http://www.itsmycodeblog.com/shuffling-a-javascript-array/
	 * @see 	https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
	 */
	shuffle: function(array) {	

	  	var currentIndex = array.length, temporaryValue, randomIndex ;

	  	// While there remain elements to shuffle...
	  	while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
	  	}

	  	return array;
	}
}