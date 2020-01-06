// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(Data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    Data.forEach(function(data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
      
    });
   
    

    // Step 2: Create scale functions
    // ==============================
    var xScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d.age) *0.9, d3.max(Data, d => d.age)*1.10])
      .range([0, width]);
    
    var yScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d.smokes)*0.9, d3.max(Data, d => d.smokes)*1.10])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale).ticks(10);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
    chartGroup.append("g")
      .call(yAxis);

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
        return (`<div>${d.state}<br> Smokes: ${d.smokes} % <br> Age: ${d.age}</div>`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(Data)
      .enter()
      circlesGroup
      .append("circle")
      .attr("cx", d => xScale(d.age))
      .attr("cy", d => yScale(d.smokes))
      .attr("r", "15")
      .attr("fill","blue")
      .attr("opacity", ".5")
      .on("click", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
      circlesGroup.append("text")
      .text(d => d.abbr)
      .attr("dx", d => xScale(d.age))
      .attr("dy", d => yScale(d.smokes)+ 15/2.5)
      .attr("font-size", "15")
      .attr("class", "stateText")
    

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    .on("mouseover", function(data) {
        toolTip.show(data, this)
        d3.select("." +data.abbr).style("stroke", "black")
        .style("visibility", "visible");
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data)
            d3.select("." +data.abbr).style("stroke", "none");
        });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokes(%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age");
  }).catch(function(error) {
    console.log(error);
  });

