var slides = null;
var slide_ndx = 0;

function init() {
	slides = d3.selectAll(".slide");
	slide_ndx = 0;

	slides.style("display", "none");
	d3.select(".slide").style("display", "block");
}

function choose_current(d, i) {
	d3.select(this).style("display", (i == slide_ndx)?"block":"none");
}

function previous() {
	if (slide_ndx == 0) return;	
	slide_ndx = slide_ndx - 1;
	slides.each(choose_current);
}

function next() {
	if (slide_ndx == slides.size() - 1) return;
	slide_ndx = slide_ndx + 1;
	slides.each(choose_current);
}
