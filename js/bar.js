var barData;
function Bar(){
    
    var w = document.getElementById("right").clientWidth;
    var h = document.querySelector("#right").clientHeight;
    var margin = {top: 10, right: 10, bottom: 30, left: 200};
    var svgWidth = w - margin.left - margin.right;
    var svgHeight = h - margin.top - margin.bottom;
    var axisLeft;
    var axisBottom;
    var bar;
    var svg;
    var myData;

      d3.csv("../data/losses2015_transformed.csv").then(function(data)
      {
          barData = data;
        myData = d3.nest()
                    .key(function(d) { return d.Damage_Descp;})
                    .rollup(function(d) { 
                      return d3.sum(d, function(g) {return g.Amount; });
                    })
                    .entries(data)
                    .sort(function (a, b) {
                    return d3.descending(a.value, b.value);})
        // datum = { key : Year, value : sum(Losses) }

        var xScale;
        var yScale;
    
    
    
        svg = d3.select("#right")
                      .append("svg")
                      .attr("width", svgWidth + margin.left + margin.right)
                      .attr("height", svgHeight + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
          // generate scales
           yScale = d3.scaleBand()
                                .domain(myData.map( function(d) 
                                  { return d.key;
                                  }))
                                .range([svgHeight, 0])
                                .paddingInner(0.05);
    
          xScale = d3.scaleLinear()
                                .domain([0, d3.max(myData, function(d) { return d.value; })])
                                .range([0, svgWidth]);
    
          // generate axis
          axisBottom = svg.append("g")
              .attr("transform", "translate(0," + (svgHeight) + ")")
              .call(d3.axisBottom(xScale));
    
          axisLeft = svg.append("g")
              // .attr("transform", "translate(0," + (svgHeight) + ")")
              .call(d3.axisLeft(yScale).ticks(5));
    
          // generate bars
          bar = svg.selectAll("rect")
              .data(myData)
              .enter()
              .append("rect")
              .attr("x", function(d, i)
                {
                  // console.log( i + " " + xScale(d.key) );
                  return 0;
                })
              .attr("y", function(d, i)
                {
                  return yScale(d.key);
                })
              .attr("height", function(d, i)
                {
                  return yScale.bandwidth();
                })
              .attr("width", function(d, i)
                {
                  return xScale(d.value);
                })
              .attr("class", "myrect");

              bar.on('mouseenter',function(d){
                
                var descData = allData.filter(function(a){
                    // console.log(a);
                      return a.Damage_Descp === d.key;
                })
                map.updateMap(descData);
            }).on("mouseleave",function(d){
                map.updateMap(sumData);
            })
    
      });




    


    this.updateBar = function(data){
        newData =  d3.nest()
        .key(function(d) { return d.Damage_Descp;})
        .rollup(function(d) { 
          return d3.sum(d, function(g) {return g.Amount; });
        })
        .entries(data)
        .sort(function (a, b) {
        return d3.descending(a.value, b.value);})
        // console.log(newData);

        yScale = d3.scaleBand()
        .domain(newData.map( function(d) 
          { return d.key;
          }))
        .range([svgHeight, 0])
        .paddingInner(0.05);

        xScale = d3.scaleLinear()
                .domain([0, d3.max(newData, function(d) { return d.value; })])
                .range([0, svgWidth]);
        axisBottom.call(d3.axisBottom(xScale));
        axisLeft.call(d3.axisLeft(yScale));
        bar.data(newData);
          //remove extra ones
        bar.exit().remove();
        //update current ones
        bar.attr("y", function(d, i)
        {
          return yScale(d.key);
        })
      .attr("height", function(d, i)
        {
          return yScale.bandwidth();
        })
      .attr("width", function(d, i)
        {
          return xScale(d.value);
        })
        //new rects
        bar.enter().append("rect").attr("y", function(d, i)
        {
          return yScale(d.key);
        })
      .attr("height", function(d, i)
        {
          return yScale.bandwidth();
        })
      .attr("width", function(d, i)
        {
          return xScale(d.value);
        })
      .attr("class", "myrect");
    }

}