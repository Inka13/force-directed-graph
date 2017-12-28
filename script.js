document.addEventListener('DOMContentLoaded',function(){
    req=new XMLHttpRequest();
    req.open("GET",'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json',true);
    req.send();
    req.onload=function(){

      const graph=JSON.parse(req.responseText);
      graph.nodes.forEach((node, i) => {
      node.id = i;
      })
      var graphic = d3.select('.graphic')
      var svg = d3.select("svg"),
          width = +svg.attr("width"),
          height = +svg.attr("height");

      var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) { return d.id; }))
          .force("charge", d3.forceManyBody().strength(-100).distanceMax(100))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("vertical", d3.forceY().strength(0.03))
          .force("horizontal", d3.forceX().strength(0.03));


      var link = svg.append("g")
          .attr("class", "links")
          .selectAll("link")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width", "1px")
          .attr("class", "link");

      var tooltip = d3.select("#tooltip");
      var node = graphic.select('.flagbox')
          .selectAll('.flag')
            .data(graph.nodes)
            .enter()
            .append('img')
	   	      .attr('class', (d) => 'flag flag-' + d.code)
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended))
            .on("mouseover", (d) => {
              tooltip.style("display", "block");
              tooltip.html(d.country)
                .style("left", (d3.event.x -15) + "px")
                .style("top", (d3.event.y - 38) + "px");
            })
            .on("mouseout", (d) => {
              tooltip.style("display", "none");
            });

      simulation
          .nodes(graph.nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links(graph.links);

      function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
        .style('left', d => (d.x-8) + "px")
        .style('top', d => (d.y-5) + "px");
      }


      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    }
});
