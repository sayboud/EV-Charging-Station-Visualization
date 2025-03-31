const margin = { top: 70, right: 30, bottom: 40, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const clock_margin = { top: 20, right: 10, bottom: 20, left: 10 };
const clock_width = 800 - margin.left - margin.right;
const clock_height = clock_width;

const innerRadius = 120;
const outerRadius = Math.min(clock_width, clock_height) / 2 - 6;





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

        const df_sorted = new Map(Array.from(df_grouped.entries())
        .filter(([key]) => !isNaN(key)).sort(([key1], [key2]) => key1 - key2) );
        console.log(df_sorted)
        peak_time_grapher(df_sorted)

        console.log('working') 


    }
}

function peak_time_grapher(data) {
    d3.select("#line-chart-container").html("");
    d3.select('#clock-chart-container').html('');

    const x = d3.scalePoint().range([0, width]).domain(data.keys()); 
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
    svg.append("text").attr("class", "y label").attr("text-anchor", "left").attr("x", 5).text("Energy Consumption (kWh)");

    if (pressed_button === 'timeofday') {
        svg.append("g").attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d => {return `${d}:00`}));

    svg.append("text").attr("class", "x label").attr("text-anchor", "end")
    .attr("x", width).attr("y", height - 5).text("Hour");
    svg.append("text").attr("class", "x label").attr("text-anchor", "middle")
    .attr("x", width/2).attr("y", height + 35).text("Energy Consumption By Time Of Day");


    clock(data);


    }

    if (pressed_button === 'dayofweek') {
        svg.append("g").attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => days[d]));

    svg.append("text").attr("class", "x label")
     .attr("x", width).attr("y", height - 5).text("Day");
    svg.append("text").attr("class", "x label").attr("text-anchor", "middle")
     .attr("x", width/2).attr("y", height + 35).text("Energy Consumption By Day Of Week");

    



    }

    if (pressed_button === 'datasetwide') {
        svg.append("g").attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

    svg.append("text").attr("text-anchor", "end")
    .attr("x", width).attr("y", height - 5).text("Year");
    svg.append("text").attr("class", "x label").attr("text-anchor", "middle")
    .attr("x", width/2).attr("y", height + 35).text("Radial Chart as a clock");
    }

    
}

function clock(data) {
    d3.select('#clock-chart-container').html('');
    const clock_svg = d3.select('#clock-chart-container').append('svg')
    .attr("width", clock_width + clock_margin.left + clock_margin.right)
    .attr("height", clock_height + clock_margin.top + clock_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (clock_width / 2 + clock_margin.left) + "," + (clock_height / 2 + clock_margin.top) + ")");

    const dataset = Array.from(data, ([key, value]) => ({ key: key, value: value }));
    
    const fullCircle = 2 * Math.PI * 23 / 24;
    const x = d3.scaleLinear().domain([0, 23]).range([0, fullCircle]);
    const y = d3.scaleLinear().domain([0, d3.max(dataset, d => d.value)]).range([innerRadius, outerRadius]);

    const line = d3.lineRadial()
    .angle(d => x(d.key))
    .radius(d => y(d.value))
    .curve(d3.curveCardinalClosed);

    clock_svg.append("path")
        .datum(dataset)
        .attr("fill", "cadetblue")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", line);

        const yAxis = clock_svg.append("g").attr("text-anchor", "middle");
        const yTick = yAxis.selectAll(".radial")
        .data(y.ticks(6))
        .enter().append("g");
    
        yTick.append("circle")
        .attr("fill", "none")
        .attr("stroke", "#D8D8D8")
        .attr("opacity", 0.5)
        .attr("r", d => y(d));

        yTick.append("text")
        .attr("y", d => -y(d)) 
        .attr("dy", "-5px") 
        .attr("text-anchor", "middle")
        .text(d => d)
        .style("font-size", "10px")
        .attr("fill", "black");

        yTick.append('text').attr("text-anchor", "middle")
        .attr("y", clock_height/2 + 7).text("Energy Consumption Over Entire Dataset");

        yTick.append('text').text('Hour').attr("text-anchor", "middle");

        yTick.append('text').text('Energy Consumption (kWh)').attr("text-anchor", "middle")
        .attr("x", clock_width /5 ).attr("y", -(clock_height/3));
    
        const xAxis = clock_svg.append("g")
            .selectAll(".radial")
            .data(d3.range(24))
            .enter().append("g")
            .attr("transform", d => "rotate(" + (x(d) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)");

            
            
    
        xAxis.append("line").attr("x2", -5).attr("stroke", "black");
        xAxis.append("text").attr("transform", d => ((x(d) < Math.PI / 2) || (x(d) > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)")
        .text(d => d).style("font-size", 10).attr("color", "black")
        
    }
    

