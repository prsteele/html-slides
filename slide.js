var slides = null;
var slide_ndx = 0;

function init() {
    slides = d3.selectAll(".slide");
    slide_ndx = 0;

    slides.style("display", "none");

    d3.select(".slide").style("display", "block");
}

function previous() {
    if (slide_ndx > 0) {
	d3.select(".slide:nth-child(" + slide_ndx + ")").transition().style("display", "none");
	d3.select(".slide:nth-child(" + (slide_ndx - 1) + ")").transition().style("display", "block");
	slide_ndx = slide_ndx - 1;
    }
}

function next() {
    if (slide_ndx < slides.size()) {
	d3.select(".slide:nth-child(" + slide_ndx + ")").transition().style("display", "none");
	d3.select(".slide:nth-child(" + (slide_ndx + 1) + ")").transition().style("display", "block");
	slide_ndx = slide_ndx + 1;
    }
}

function foo() {
    var s1 = d3.select("#slide-1");
    var s2 = d3.select("#slide-2");


    s1.style("color", "red").transition().style("color", "blue");
}
