const map = L.map('interactive-map').setView([37.4419, -122.15], 15);
const margin = { top: 70, right: 15, bottom: 40, left: 40 };
const width = 400 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;
let df_peak_time = [], get_keys, pressed_button = '', days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
{attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',}).addTo(map);
console.log('done')

let df = [], df_station = [], stationselect = null;

d3.csv('stations.csv').then(function(data) {
console.log('working',data)
data.forEach(d => {
    const Latitude = d['Latitude'];
    const Longitude = d['Longitude']
    const Station_Name = d['Station Name']

    let station = L.marker([Latitude,Longitude]).addTo(map);
    station.on('click', function () {
        stationselect = Station_Name;
        console.log(stationselect);

        if (stationselect) {
            d3.csv('charging_sessions_cleaned.csv').then(
                function(data) {
                    df_station = data.filter(d => d['Station Name'] === stationselect);
                    document.getElementById('stationname').textContent = stationselect;
                    data_grouper(df_station);
                }
            )
            document.getElementById("timeofday").addEventListener("click", function() {
                get_keys = d => new Date(d["End Date"]).getHours();
                pressed_button = 'timeofday'
                data_grouper(df_station);
                
            });
            document.getElementById('dayofweek').addEventListener("click", function() {
                get_keys = d => new Date(d["End Date"]).getDay();
                pressed_button = 'dayofweek'
                data_grouper(df_station);
            });
            document.getElementById('datasetwide').addEventListener("click", function() {
                get_keys = d => new Date(d["End Date"]).getFullYear();
                pressed_button = 'datasetwide'
                data_grouper(df_station);
            });

            

        };

        

        });
    });
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
    d3.select("#station-line-chart-container").html("");

   const x = d3.scalePoint().range([0, width]).domain(data.keys()); 
   const y = d3.scaleLinear().domain([0, d3.max(data.values())])
        .nice()
        .range([height, 0]);

    const svg = d3.select("#station-line-chart-container").append("svg")
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
    .call(d3.axisBottom(x));


    }

    if (pressed_button === 'dayofweek') {
        svg.append("g").attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => days[d]));

    }

    if (pressed_button === 'datasetwide') {
        svg.append("g").attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));


    }
    console.log('graphing done')

    
}








