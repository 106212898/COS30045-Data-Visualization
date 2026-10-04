const drawScatterPlot = (data) => {
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
    
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const maxStar = d3.max(data, d => d.star);
    const maxEng = d3.max(data, d => d.energyConsumption);

    console.log("maxStar:", maxStar, "maxEng:", maxEng);

    xScaleS
        .domain([0, maxStar])
        .range([0, innerWidth]);

    yScaleS
        .domain([0, maxEng])
        .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.screenTech))
        .range(d3.schemeCategory10);

    innerChartS
        .selectAll("circle")
        .data(data)
        .join("circle")
            .attr("r", 5)
            .attr("cx", d => xScaleS(d.star))
            .attr("cy", d => yScaleS(d.energyConsumption))
            .attr("fill", d => colorScale(d.screenTech))
            .attr("opacity", 0.5);

    const axisColor = "#5c4033";

    innerChartS
        .append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .attr("color", axisColor)
        .call(d3.axisBottom(xScaleS));

    innerChartS
        .append("g")
        .attr("color", axisColor)
        .call(d3.axisLeft(yScaleS).tickFormat(d3.format(",")));

    innerChartS
        .append("text")
        .attr("x", -margin.left + 18)
        .attr("y", -12)
        .attr("fill", axisColor)
        .attr("font-size", "14px")
        .attr("font-family", "Roboto, sans-serif")
        .text("Labeled Energy Consumption (kWh/year)");

    innerChartS
        .append("text")
        .attr("x", innerWidth)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "end")
        .attr("fill", axisColor)
        .attr("font-size", "14px")
        .attr("font-family", "Roboto, sans-serif")
        .text("Star Rating");

    const legend = svg 
        .append("g")
        .attr("transform", `translate(${width - 100}, ${margin.top})`);

    colorScale.domain().forEach((screenTech, i) => {
        
        const legendRow = legend   
            .append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(screenTech));

        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .attr("text-anchor", "start")
            .style("alignment-baseline", "middle")
            .text(screenTech);
    })
}