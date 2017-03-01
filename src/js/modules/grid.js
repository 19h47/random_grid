module.exports = Grid;

var $ = require('jquery');
var fn = require('../functions.js');



/**
 * Grid
 */
function Grid(element, options) {
 	if (!(this instanceof Grid)) {
        return new Grid();
    }

    // If element doesn't exist, return
    if (!element || !element.length) {
    	return;
    }

    this.element = element;
    this.$element = $(this.element);

    this.defaults = {
    	itemNumber: 6,
    	innerElement: '.js-clients-card'
    };

    this.options = $.extend({}, this.defaults, options);

    this.datas = this.options.datas;
    this.itemNumber = this.options.itemNumber;
    this.innerElement = this.options.innerElement;

    // Number of tile to display in Clients
  	this.urls;

  	this.arrayUrls = [];
  	this.currentDatasList = [];
  	this.waitingDatasList = [];

  	// Lottery values
  	this.lotteryValues = [];
  	this.currentValue;

  	// Start to -1 to be increment instantly to 0 on init
  	this.currentIndex = -1;

  	// RequestAnimationFrame vars
  	this.lastTimestamp = 0;
  	this.interval = 3000;
  	this.init = true;

    // Clients.setup 
    this.setup();
}


Grid.prototype = {
	
	/**
	 * Grid.setup
	 */
	setup: function() {
		// console.info('Grid.setup');

		var _this = this;

		// Shuffle array of urls
		this.shuffle(this.datas);

		// construct the current array
		this.constructCurrentArrayList(this.currentDatasList, this.datas, this.itemNumber);
		
		// Select card
		$content = this.$element.find('.js-card-content');

		$content.each(function(i) {

			var currentImg = $(this).find('img');

			currentImg.attr('src', _this.currentDatasList[i]['url']);
			currentImg.attr('height', _this.currentDatasList[i]['height']);
			currentImg.attr('width', _this.currentDatasList[i]['width']);

			// Clone this element, add the `next` class and add it next to him
			$(this).clone().addClass('next').insertAfter($(this));

			// After cloning, add `current` class to the element
			$(this).addClass('current');

		});

		// If there is at least as many datas as number, no need to continue
		if (this.datas.length === this.itemNumber) {
			return;
		}

		// Construct waiting urls array
		this.constructWaitingList(this.waitingDatasList, this.datas, this.itemNumber);

		// Construct pattern values array
		this.constructLotteryValues(this.lotteryValues, this.itemNumber);

		// Shuffle pattern values array
		this.shuffle(this.lotteryValues);

		// Set current value to the first entry of pattern values array
		this.currentValue = this.lotteryValues[0];

		// Set current index to 0
		this.currentIndex = 0;

		// request animation frame
		this.render();

		this.initEvents();
	},


	/**
	 * Grid.initEvents
	 */
	initEvents: function() {
		// console.initEvents
		
		$(document)
			.on('keydown.clients', $.proxy(function(e) {
				
				// Right key
				e.which === 39 && this.update();

				// Delete key
				e.which === 46 && console.clear();

			}, this));

	},


	/**
	 * Grid.constructCurrentArrayList
	 *
	 * @param 	currentArrayList	current array list
	 * @param  	array 				array origin
	 * @param 	number				number of element to stock in `currentArrayList`
	 */
	constructCurrentArrayList: function(currentArrayList, array, number) {
		// console.info('Grid.constructCurrentArrayList');

		for (var i = 0; i < number; i++) {
		    	
	    	currentArrayList.push(array[i]);	  
		}
	},


	/**
	 * GridGrid.constructLotteryValues
	 *
	 * @param 	array
	 * @param 	number
	 */
	constructLotteryValues: function(array, number) {
		// console.info('Gird.constructLotteryValues');

		for (var i = 1; i <= number; i++) {
			
			array.push(i);
		}
	},


	/**
	 * GridGrid.constructWaitingList
	 *
	 * @param 	waitingList
	 * @param 	array
	 * @param 	number
	 */
	constructWaitingList: function(waitingList, array, number) {
		// console.info('GridGrid.constructWaitingList');

		for (var i = number; i < array.length; i++) {

			waitingList.push(array[i]);
		}
	},


	/**
	 * GridGrid.update
	 */
	update: function() {
		// console.log('GridGrid.update');
		
		// Increment currentIndex
		this.currentIndex += 1;

		// On first init, the current index is egal to 0
		if(this.init) {
			this.init = false;
			this.currentIndex = 0;	
		}

		// If index is strictly egal to item number, reset current index
		if( this.currentIndex == this.itemNumber ) {

			this.currentIndex = 0;
		}

		// Update all arrays
		this.waitingDatasList.push(this.currentDatasList[this.currentIndex]);
		this.currentDatasList[this.currentIndex] = this.waitingDatasList[0];
		this.waitingDatasList.shift(0);

		// Current Value
		this.currentValue = this.lotteryValues[this.currentIndex];
		
		// Select current element
		var currentElement = this.$element.find(this.innerElement).eq(this.currentValue - 1)
		var $current = currentElement.find('.current');

		// Select current next
		var $next = currentElement.find('.next');
		var $nextImg = $next.find('img');

		// Update img src, height, and width attribute
		$nextImg.attr('width', this.waitingDatasList[0]['width'] + 'px');
		$nextImg.attr('height', this.waitingDatasList[0]['height'] + 'px');
		$nextImg.attr('src', this.waitingDatasList[0]['url']);
		
		// When current finished his transition
		$current.one('transitionend', function() {

			$(this).removeClass('previous is-animating').addClass('next');
			
		});

		// When current next finished his transition
		$next.one('transitionend', function() {

			$(this).removeClass('is-animating');
			
		});

		$next.removeClass('next').addClass('current is-animating');
		$current.removeClass('current').addClass('previous is-animating');

		console.group('Current');
		console.log(this.lotteryValues);
		console.log('currentIndex - ' + this.currentIndex);
		console.log('currentValue - ' + this.currentValue);
		console.log('currentDatasList[\'url\'] - ' + this.currentDatasList[this.currentIndex]['url']);
		console.log('waitingDatasList[\'url\'] - ' + this.waitingDatasList[0]['url']);
		console.log(this.currentDatasList);
		console.log(this.waitingDatasList);
		console.groupEnd();	

	},


	/**
	 * GridGrid.shuffle
	 *
	 * Random Shuffling An Array the Fisher-Yates way
	 *
	 * @param 	array
	 * @return 	array
	 * @see  	http://www.itsmycodeblog.com/shuffling-a-javascript-array/
	 * @see 	https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
	 */
	shuffle: function(array) {
		// console.info('Clients.shuffle');

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
	},


	/**
	 * Grid.render
	 *
	 * Request animation frame
	 * 
	 * @param 	timestamp
	 */
	render: function(timestamp) {
	    if (timestamp > this.lastTimestamp + this.interval ) {
        	// console.log('Grid.render');

        	this.lastTimestamp = timestamp;

        	this.update();
	    }

    	this.rafId = requestAnimationFrame(this.render.bind(this));   
	}
};