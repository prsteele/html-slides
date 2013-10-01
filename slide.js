/**
 * Events
 * ======
 *
 * We use an event framework to control the behavior of the slideshow.
 *
 * previous
 *
 *   This event is called to indicate that the user would like to 'go
 *   back' in the presentation, either by 
 *
 *
 *
 */

function Slideshow() {
    this.slides = d3.select();
    this.slide_ndx = 0;
    this.stage_ndx = 0;
    this.dispatch = null;

    // Maps the index of each slide to a dictionary of associated data.
    // The dictionaries have the form
    //
    // {
    //    "slide": The singleton selection containing the slide,
    //    "stages": The selection containing all stages in the slide,
    //    "stage": The current stage value
    // }
    this.slide_data = {}


    // Initialize the object; we separate initialization from
    // construction to allow explicit reinitialization later without
    // construting a new object.
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
    this.slides = d3.selectAll(".slide");

    // Reset the location of the slide show; start from the beginning
    this.slide_ndx = 0;

    // Initialize all slide data in `this.slide_data`
    this.slides.each(this.process_slide());

    // Set up slide events and listeners
    this.dispatch = d3.dispatch("previous",
			      "previous_slide",
			      "previous_stage",
			      "next",
			      "next_slide",
			      "next_stage",
			      "update"
			  );
    this.dispatch.on("previous", previous_listener);
    this.dispatch.on("previous_slide", previous_slide_listener);
    this.dispatch.on("previous_stage", previous_stage_listener);
    this.dispatch.on("next", next_listener);
    this.dispatch.on("next_slide", next_slide_listener);
    this.dispatch.on("next_stage", next_stage_listener);
    this.dispatch.on("update", update_listener);

    // Update the display
    this.dispatch.update();
}

/**
 * Returns a function that is used to assign data to `this.slide_data`
 * from a `d3.selection` of slides.
 */
Slideshow.prototype.process_slide = function () {
    _this = this;
    return function (d, i) {
	_this.slide_data[i] = {
	    "slide": d3.select(this),
	    "stages": d3.selectAll(".reveal, .stage"),
	    "stage": -1
	}
    }
}

/**
 * Returns a function that can be used to update the visibility of a
 * slide. In particular, it returns a function that can be applied to
 * a d3.selection. Since d3 overrides the `this` value in such
 * functions, we close over `this` as `_this`.
 */
Slideshow.prototype.display_slide = function () {
    _this = this;
    return function (d, i) {
	var data = _this.slide_data[i];
	if (i == _this.slide_ndx) {
	    // If this slide is displayed, display it, and display the
	    // appropriate stages
	    data.slide.style("display", "block");
	    data.stages.each(_this.display_stage(d["stage_ndx"]));
	} else {
	    // Otherwise, hide the slide
	    data.slide.style("display", "none");
	}
    }
}

/**
 * Returns a function that will display a stage if its index is less
 * than or equal to `stage_ndx`. In particular, it returns a function
 * that can be applied to a d3.selection. Since d3 overrides the
 * `this` value in such functions, we close over `this` as `_this`.
 */
Slideshow.prototype.display_stage = function (stage_ndx) {
    _this = this;
    return function (d, i) {
	d3.select(this).classed("revealed", i <= stage_ndx);
	d3.select(this).classed("unrevealed", i > stage_ndx);
    }
}

/**
 * This function is called to update the visibility of all slides and
 * reveals. The slide specified by `this.slide_ndx` will be displayed,
 * along with the first `this.stage_ndx + 1` reveals on the slide.
 */
Slideshow.prototype.update_listener = function () {
    this.slides.each(this.display_slide());
}

/**
 * Listens for `previous` events and emits either `previous_stage`
 */
Slideshow.prototype.previous_listener = function () {
    if (this.stage_ndx > -1) {
	// If the current slide can un-reveal something, do so
	this.dispatch.previous_stage();
    } else if (this.slide_ndx > 0) {
	// Otherwise, if there is a previous slide go to it
	this.dispatch.previous_slide();
    }
}

/**
 * Listens for `previous_slide` events and acts accordingly.
 */
Slideshow.prototype.previous_slide_listener = function () {
    if (this.slide_ndx > 0) {
	this.slide_ndx -= 1;
	this.dispatch.update();
    }
}

/**
 * Listens for `previous_stage` events and acts accordingly.
 */
Slideshow.prototype.previous_stage_listener = function () {
    if (this.current_slide.datum()["stage_ndx"] > 0) {
	this.slide_ndx -= 1;
	this.dispatch.update();
    }
}

/**
 * Listens for the "next" events and changes the displayed slide
 * accordingly.
 */
Slideshow.prototype.next_listener = function () {
    if (this.stage_ndx < this.reveals.size() - 1) {
	// If the current slide can reveal something, do so
	this.dispatch.next_stage();
    } else if (this.slide_ndx < this.slides.size() - 1) {
	// Otherwise, if there is a next slide go to it
	this.dispatch.next_slide();
    }
}

/**
 * Convenience function; returns a selection containing all children
 * of a selection `sel` that are marked to be revealed.
 */
function stages(sel) {
    return sel.selectAll(".reveal");
}
