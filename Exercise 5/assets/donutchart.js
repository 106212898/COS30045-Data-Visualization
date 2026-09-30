d3.csv("assets/Data2.csv", d => {
  return {
    label: d.Screensize_Category,   
    value: +d.Count                 
  };
}).then(data => {
  console.log(data);                
  drawDonutChart(data);             
});