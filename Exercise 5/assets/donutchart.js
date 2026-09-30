d3.csv("assets/Data2.csv", d => {
  return {
    label: d.Screensize_Category,   // matches the CSV column name exactly
    value: +d.Count                 // + converts the text "1352" to a number
  };
}).then(data => {
  console.log(data);                // check the rows in the browser console
  drawDonutChart(data);             // pass the loaded rows to the chart
});