// The D3 selection containing all the slides
var slides = null;

// The index of the currently displayed slide
var slide_ndx = 0;

// The index of the current revealed item
var reveal_ndx = -1;

// The D3 selection containing the current slide
var current_slide = null;

// The D3 selection containing the elements to be revealed on the
// current slide
var reveals = null;

// Are we moving forwards or backwards in the slide deck? Needed when
// computing which items to reveal when transitioning between slides.
var forwards = true;

function init() {
    slides = d3.selectAll(".slide");
    current_slide = d3.select(".slide").style("display", "block");
    slide_ndx = 0;

    slides.each(choose_current);
}

function choose_current(d, i) {
    if (i == slide_ndx) {
	current_slide = d3.select(this);
    	current_slide.style("display", "block");

	reveals = current_slide.selectAll(".reveal");
	reveal_ndx = forwards ? -1 : reveals.size() - 1;
	reveals.each(choose_reveal);
    } else {
    	d3.select(this).style("display", "none");
    }
}

function choose_reveal(d, i) {
    d3.select(this)
	.classed("revealed", i <= reveal_ndx)
	.classed("unrevealed", i > reveal_ndx);
}

function previous() {
    forwards = false;

    if (reveals != null && reveal_ndx > -1) {
	// If the current slide can un-reveal something, do so
	reveal_ndx -= 1;
	reveals.each(choose_reveal);
    } else if (slide_ndx > 0) {
	// Otherwise, try to go back one slide
	slide_ndx -= 1;
	slides.each(choose_current);
    }
}

function next() {
    forwards = true;

    if (reveals != null && reveal_ndx < reveals.size() - 1) {
	// If the current slide can reveal something, do so
	reveal_ndx += 1;
	reveals.each(choose_reveal);
    } else if (slide_ndx < slides.size() - 1) {
	// Otherwise, try to go forward one slide
	slide_ndx = slide_ndx + 1;
	slides.each(choose_current);
    }
}
