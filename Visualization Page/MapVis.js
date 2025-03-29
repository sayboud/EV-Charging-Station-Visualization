const width = 2000
const height = 1000 


let df_map = [], df_california = [];

const svg = d3.select('#interactive-map').append('svg').attr('width',width)
.attr('height',height);

var projection = d3.geoMercator()
    .center([-122.143, 37.4419])  
    .scale(200000)                
    .translate([ width/2, height/2 ])

const path = d3.geoPath().projection(projection);

const g = svg.append("g");

d3.json("https://raw.githubusercontent.com/ropensci/geojsonio/main/inst/examples/california.geojson")
.then(function(data) {
df_california = data;


svg.append("g")
            .append("path")
            .datum(data)  
            .attr("fill", "#b8b8b8")
            .attr("stroke", "black")
            .attr("opacity", 0.7)
            .attr("d", path);
            

console.log('done')

});
