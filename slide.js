var ss = (function () {
    function Slide(selection) {
	// The d3.selection referring to the slide
	this.selection = selection;

	// The stages in this slide
	this.stages = selection.selectAll(".reveal");

	// The current stage displayed in the slide
	this.stage_ndx = -1;
    }

    /**
     * Sets the visibility of the slide. If `display' is true then the
     * slide is displayed, otherwise it is not. If displayed, sets
     * visibility rules for all stages as well.
     */
    Slide.prototype.display = function (display) {
	if (display) {
	    this.selection.style("display", "block");
	    this.display_stages();
	    this.fill();
	} else {
	    this.selection.style("display", "none");
	}
    }

    /**
     * Calling this function sets the heights of all "fill" class
     * elements to the appropriate height.
     */
    Slide.prototype.fill = function () {
	var fills = this.selection.selectAll(".fill");
	if (fills.size() <= 0) {
	    return;
	}

	// First, set the height of all fills to zero
	fills.each(function (d, i) {
	    d3.select(this).style("height", "0px");
	});

	// Now adjust the height of the elements to be the appropriate
	// height
	var full_height = parseInt(d3.select("#slides").style("height"), 10);
	var slide_height = parseInt(this.selection.style("height"), 10);

	// If we fail to parse the heights (somehow) return
	if (isNaN(full_height) || isNaN(slide_height)) {
	    return;
	}

	// If there is no room left for padding, do nothing
	if (full_height <= slide_height) {
	    return;
	}

	// Otherwise, increase the height of each element marked
	// "fill" by `dh`
	var dh = (full_height - slide_height) / fills.size();
	fills.each(function (d, i) {
	    var el = d3.select(this);

	    var cur_height = parseInt(el.style("height"), 10);
	    if (isNaN(cur_height)) {
		return;
	    } else {
		el.style("height", dh + "px");
	    }
	});
    }

    /**
     * Sets the visibility for all stages in this slide according to
     * `this.stage_ndx`.
     */
    Slide.prototype.display_stages = function () {
	var stage_ndx = this.stage_ndx;
	this.stages.each(function (d, i) {
	    d3.select(this)
		.classed("revealed", i <= stage_ndx)
		.classed("unrevealed", i > stage_ndx);
	});
    }

    function Slideshow() {
	// An array of Slide objects representing the slides in the slide
	// show
	this.slides = [];

	// The index of the currently displayed slide
	this.slide_ndx = 0;

	// Initialize the object; we separate initialization from
	// construction to allow explicit reinitialization later without
	// constructing a new object.
	this.init();
    }

    /**
     * This function initializes all data the in the `Slideshow` object,
     * traversing the DOM tree to find all slides. This function can be
     * called at any time to reinitialize the slide show, which can be
     * used to update the slide show if content is added dynamically.
     */
    Slideshow.prototype.init = function () {
	// Find all slides
	var slides = d3.selectAll(".slide");

	// Reset the location of the slide show; start from the beginning
	this.slide_ndx = 0;

	// Construct all Slide objects from the selection, which will be stored in this.slides
	this.slides = [];
	slides.each(this.process_slide());

	// Update the display
	this.update();
    }

    /**
     * Returns a function that is used to assign data to `this.slide_data`
     * from a `d3.selection` of slides.
     */
    Slideshow.prototype.process_slide = function () {
	_this = this;
	return function (d, i) {
	    _this.slides.push(new Slide(d3.select(this)));
	}
    }

    /**
     * This function is called to update the visibility of all slides and
     * reveals. The slide specified by `this.slide_ndx` will be displayed,
     * along with the first `this.stage_ndx + 1` reveals on the slide.
     */
    Slideshow.prototype.update = function () {
	for (var i = 0; i < this.slides.length; i++) {
	    this.slides[i].display(i == this.slide_ndx);
	}
    }

    /**
     * Listens for `previous` events and emits either `previous_stage`
     */
    Slideshow.prototype.previous = function () {
	var cur_slide = this.slides[this.slide_ndx];
	if (cur_slide.stage_ndx > -1) {
	    // If the current slide can un-reveal something, do so
	    this.previous_stage();
	} else if (this.slide_ndx > 0) {
	    // Otherwise, if there is a previous slide go to it
	    this.previous_slide();
	}
    }

    /**
     * Listens for `previous_slide` events and acts accordingly.
     */
    Slideshow.prototype.previous_slide = function () {
	if (this.slide_ndx > 0) {
	    this.slide_ndx -= 1;
	    this.update();
	}
    }

    /**
     * Listens for `previous_stage` events and acts accordingly.
     */
    Slideshow.prototype.previous_stage = function () {
	var cur_slide = this.slides[this.slide_ndx];
	if (cur_slide.stage_ndx > -1) {
	    cur_slide.stage_ndx -= 1;
	    this.update();
	}
    }

    /**
     * Listens for the "next" events and changes the displayed slide
     * accordingly.
     */
    Slideshow.prototype.next = function () {
	var cur_slide = this.slides[this.slide_ndx];
	if (cur_slide.stage_ndx < cur_slide.stages.size() - 1) {
	    // If the current slide can reveal something, do so
	    this.next_stage();
	} else if (this.slide_ndx < this.slides.length - 1) {
	    // Otherwise, if there is a next slide go to it
	    this.next_slide();
	}
    }

    /**
     * Listens for `previous_slide` events and acts accordingly.
     */
    Slideshow.prototype.next_slide = function () {
	if (this.slide_ndx < this.slides.length) {
	    this.slide_ndx += 1;
	    this.update();
	}
    }

    /**
     * Listens for `previous_stage` events and acts accordingly.
     */
    Slideshow.prototype.next_stage = function () {
	var cur_slide = this.slides[this.slide_ndx];
	if (cur_slide.stage_ndx < cur_slide.stages.size() - 1) {
	    cur_slide.stage_ndx += 1;
	    this.update();
	}
    }

    var ss = new Slideshow();

    window.onload = function () {
	ss.init();
    };

    return ss;
})();