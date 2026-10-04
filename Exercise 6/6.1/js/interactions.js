const populateFilters = (data) => {
    const filters_screen = [
        { id: "all", label: "All", isActive: true},
        { id: "LED", label: "LED", isActive: false},
        { id: "LCD", label: "LCD", isActive: false},
        { id: "OLED", label: "OLED", isActive: false}
    ];

    // new: size buttons (ids are numbers so they match the data)
    const filters_size = [
        { id: "all", label: "All sizes", isActive: true},
        { id: 24, label: '24"', isActive: false},
        { id: 32, label: '32"', isActive: false},
        { id: 55, label: '55"', isActive: false},
        { id: 65, label: '65"', isActive: false},
        { id: 98, label: '98"', isActive: false}
    ];

    // remember which button is selected in each group
    let activeScreen = "all";
    let activeSize = "all";

    const binGenerator = d3.bin()
        .value(d => d.energyConsumption);

    // lock the bin edges to the full data, so filtered bars use the same bins
    const fullBins = binGenerator(data);
    binGenerator
        .domain([fullBins[0].x0, fullBins[fullBins.length - 1].x1])
        .thresholds(fullBins.slice(0, -1).map(b => b.x1));

    // keeps only the TVs that match BOTH selected filters
    const updateHistogram = () => {
        const updatedData = data.filter(tv =>
            (activeScreen === "all" || tv.screenTech === activeScreen) &&
            (activeSize === "all" || +tv.screenSize === activeSize)
        );

        const updatedBins = binGenerator(updatedData);

        d3.selectAll("#histogram rect")
            .data(updatedBins)
            .transition()
                .duration(500)
                .ease(d3.easeCubicInOut)
                .attr("y", d => yScale(d.length))
                .attr("height", d => innerHeight - yScale(d.length));
    };

    // draws one group of buttons; onSelect saves the chosen id
    const drawFilterButtons = (selector, filters, onSelect) => {
        d3.select(selector)
            .selectAll(".filter")
            .data(filters)
            .join("button")
                .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
                .text(d => d.label)
                .on("click", (e, d) => {
                    if (!d.isActive) {
                        filters.forEach(filter => {
                            filter.isActive = d.id === filter.id;
                        });

                        d3.selectAll(`${selector} .filter`)
                            .classed("active", filter => filter.id === d.id);

                        onSelect(d.id);
                        updateHistogram();
                    }
                });
    };

    drawFilterButtons("#filters_screen", filters_screen, id => activeScreen = id);
    drawFilterButtons("#filters_size", filters_size, id => activeSize = id);
};