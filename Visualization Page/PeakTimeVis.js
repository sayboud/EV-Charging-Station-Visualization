const margin = { top: 70, right: 30, bottom: 40, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
let df_peak_time = [], get_keys, pressed_button = '', days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

d3.csv("charging_sessions_cleaned.csv").then(function(data) {
df_peak_time = data;
});

document.getElementById("timeofday").addEventListener("click", function() {
    get_keys = d => new Date(d["End Date"]).getHours();
    pressed_button = 'timeofday'
    data_grouper(df_peak_time);
    
});
document.getElementById('dayofweek').addEventListener("click", function() {
    get_keys = d => new Date(d["End Date"]).getDay();
    pressed_button = 'dayofweek'
    data_grouper(df_peak_time);
});
document.getElementById('datasetwide').addEventListener("click", function() {
    get_keys = d => new Date(d["End Date"]).getFullYear();
    pressed_button = 'datasetwide'
    data_grouper(df_peak_time);
});

function data_grouper(data) {
    if (get_keys) {
    const df_grouped = d3.rollup(data,
        v => d3.sum(v,d => d["Energy (kWh)"]),
        d => get_keys(d));

        const df_sorted = new Map(Array.from(df_grouped.entries()).filter(([key]) => !isNaN(key)).sort(([key1], [key2]) => key1 - key2) );
        console.log(df_sorted)
        peak_time_grapher(df_sorted)


    }
}

function peak_time_grapher(data) {
    d3.select("#line-chart-container").html("");

   const x = d3.scalePoint().range([0, width]).domain(data.keys()).padding(0.5); 
   const y = d3.scaleLinear().domain([0, d3.max(data.values())])
        .nice()
        .range([height, 0]);

    const svg = d3.select("#line-chart-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const line = d3.line().x(d => x(d[0])).y(d => y(d[1]))
        .curve(d3.curveMonotoneX); 

    svg.append("path").datum(data).attr("fill", "none")
    .attr("stroke", "steelblue").attr("stroke-width", 2)
    .attr("d", line);
 
    svg.append("g").call(d3.axisLeft(y));

    if (pressed_button === 'timeofday') {
        svg.append("g").attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d => {return `${d}:00`}));

        svg.append("line").attr("x1", 0).attr("x2", width)
        .attr("y1", y(100000)).attr("y2", y(100000)).attr("stroke", "red")
        .attr("stroke-width", 2)
    }

    if (pressed_button === 'dayofweek') {
        svg.append("g").attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => days[d]));

        }

    if (pressed_button === 'datasetwide') {
        svg.append("g").attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
    }

    
}