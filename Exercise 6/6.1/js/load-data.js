d3.csv("Data/Data.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption,
    star: +d.star
    
})).then(data => {
    console.log(data);
    drawHistogram(data);
    drawScatterPlot(data);
    populateFilters(data);
    createToolTip();
    handleMouseEvents();

}).catch(error => {
    console.error("Error loading the CSV file:", error);
});