var states;
var years;
const text = [
    "High",
    "Bach",
    "Adv",    
];
const legendText = [
    "High school or more",
    "Bachelor's or more",
    "Advanced degree"
]
d3.tsv("states.tsv",function(data){
    states = data;
    d3.tsv("years.tsv",function(data){
        years = data;

        var data = process(states,years);
        solveQ1(data[1].years);

        solveQ2(data,'High');
        solveQ2(data,'Bach');
        solveQ2(data,'Adv');

        solveQ3(data);
    })
})

var solveQ3 = function(resourcesForThree){
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1280 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#q3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var slider = svg.append("g")
    .attr("class","slider");

    slider.append("line")
    .attr("class", "track")
}

var solveQ2 = function(resourcesForTwo,cate){
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1280 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#q2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(resourcesForTwo.map(function(d) { return d.abbre; }));
    y.domain([0, d3.max(resourcesForTwo, function(d) { return d.years[5][cate]; })]);

     svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Percentage");

      svg.selectAll(".bar")
    .data(resourcesForTwo)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.abbre); })
      .attr("y", function(d) { return y(d.years[5][cate]); })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return height - y(d.years[5][cate]); });
}



var solveQ1 = function(data){
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#7b6888", "#6b486b", "#a05d56", "#d0743c"]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#q1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d.objYear = text.map(function(year) { return {year: year, value: +d[year]}; });
    });

    data.forEach(function(d){
        console.log(d);
    });
    
    x0.domain(data.map(function(d) { return d.year; }));
    x1.domain(text).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.objYear, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(0)")
        .attr("y", 6)
        .attr("dy", "-.7em")
        .attr("dx","2em")
        .style("text-anchor", "end")
        .text("Percentage");

    var state = svg.selectAll(".year")
        .data(data)
        .enter().append("g")
        .attr("class", "year")
        .attr("transform", function(d) { return "translate(" + x0(d.year) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.objYear; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.year); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.year); });

    var legend = svg.selectAll(".legend")
        .data(legendText)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size","10px")
        .text(function(d) { return d; });
}

var getYearList = function(loc){
    var re = [
        {
            year:"1990",
            High:loc.nityHigh,
            Bach:loc.nityBach,
            Adv:loc.nityAdv
        },
        {
            year:"2000",
            NotHigh:0,
            High:loc.twiHigh,
            Bach:loc.twiBach,
            Adv:loc.twiAdv
        },
        {
            year:"2006",
            NotHigh:0,
            High:loc.sixHigh,
            Bach:loc.sixBach,
            Adv:loc.sixAdv
        },
        {
            year:"2007",
            NotHigh:0,
            High:loc.sevenHigh,
            Bach:loc.sevenBach,
            Adv:loc.sevenAdv
        },
        {
            year:"2008",
            NotHigh:0,
            High:loc.eightHeigh,
            Bach:loc.eightBach,
            Adv:loc.eightAdv
        },
        {
            year:"2009",
            NotHigh:0,
            High:loc.nineHigh,
            Bach:loc.nineBach,
            Adv:loc.nineAdv
        },
    ];
    return re;
}

var process = function(d1,d2){
    var len = d1.length;
//    console.log("d1 len:"+d1.length+" d2 len:"+d2.length);
    var re = [];
    for(var i=1;i<len;i++){
        var obj = {
            state:d1[i].State,
            abbre:d1[i].Post_Office_Abbreviation,
            years:getYearList(d2[i-1])
        }

        re.push(obj);
//        console.log(obj);
    }

    return re;
}

