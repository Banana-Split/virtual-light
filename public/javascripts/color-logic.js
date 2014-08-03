// console.log("This is color logic")
// var Color = net.brehaut.Color;

// var Cyan = Color({hue: 180, saturation: 1, lightness: 0.5});

// // console.log("This is color logic")
// console.log(Cyan.toCSS())

  var data =  {"attributes": {"cluster": false, "overlay": false}, "nodes": [{"picture": "women/49.jpg", "name": "mildred campbell", "__cluster__": null, "mapping": {"0": "name", "1": "picture"}, "__tags__": " ", "id": 0}, {"picture": "women/47.jpg", "name": "daisy chavez", "__cluster__": null, "mapping": {"0": "name", "1": "picture"}, "__tags__": " ", "id": 1}, {"picture": "women/69.jpg", "name": "naomi hernandez", "__cluster__": null, "mapping": {"0": "name", "1": "picture"}, "__tags__": " ", "id": 2}], "links": [{"right": true, "target": 1, "weight": "", "__connector__": "->", "source": 0, "left": false}, {"right": true, "target": 2, "weight": "", "__connector__": "->", "source": 0, "left": false}, {"right": true, "target": 0, "weight": "", "__connector__": "->", "source": 1, "left": false}, {"right": true, "target": 2, "weight": "", "__connector__": "->", "source": 1, "left": false}, {"right": true, "target": 0, "weight": "", "__connector__": "->", "source": 2, "left": false}, {"right": true, "target": 1, "weight": "", "__connector__": "->", "source": 2, "left": false}], "lastNodeId": 2};
  console.log(data);
  var tooltipId = tooltipId;
  $("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");

    $("#"+tooltipId).css("width", "300px");

  function hideTooltip(){
    $("#"+tooltipId).hide();
  }

  hideTooltip();

  function showTooltip(content, event) {
    $("#"+tooltipId).html(content);
    $("#"+tooltipId).show();

    updatePosition(event);
  }

  function updatePosition(event){
    var ttid = "#"+tooltipId;
    var xOffset = 20;
    var yOffset = 10;

    var toolTipW = $(ttid).width();
    var toolTipeH = $(ttid).height();
    var windowY = $(window).scrollTop();
    var windowX = $(window).scrollLeft();
    var curX = event.pageX;
    var curY = event.pageY;
    var ttleft = ((curX) < $(window).width() / 2) ? curX - toolTipW - xOffset*2 : curX + xOffset;
    if (ttleft < windowX + xOffset){
      ttleft = windowX + xOffset;
    } 
    var tttop = ((curY - windowY + yOffset*2 + toolTipeH) > $(window).height()) ? curY - toolTipeH - yOffset*2 : curY + yOffset;
    if (tttop < windowY + yOffset){
      tttop = curY + yOffset;
    } 
    $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
  }


            var tooltip = Tooltip("vis-tooltip", 230);
            var lerp = function(a, b, t) {
                return a + (b - a) * t;
            };
            var node_data = [], lastNodeId, links = [], attributes, node_clusters = {}, node, circle;
            var margin = 50, diameter = window.innerHeight;

            function dispatch() {
                    
                    mapping = {};
                    index = 0;
                    attributes = data.attributes;
                      $.each(data.nodes,function(i,node){
                            node_data.push(node);
                            mapping[node["id"]] = index;
                            index = index+1;
                          });
                          lastNodeId = data["lastNodeId"];
                          $.each(data.links,function(i,link){
                            links.push({"source": mapping[link["source"]], "target": mapping[link["target"]], "left": link["left"], "right": link["right"], "weight": link["weight"]});
                          }); 
                
                if (attributes["cluster"]) {
                    node_clusters["name"] = "clusters";
                    node_clusters["children"] = [];
                    temp_mapping = {};
                    $.each(node_data, function(i, node){
                        cluster = node["__cluster__"];
                        entry = {};
                        for (key in node.mapping) {
                            entry[node["mapping"][key]] = node[node["mapping"][key]];
                        }
                        entry["size"] = 1;
                        entry["mapping"] = node["mapping"];
                        if (temp_mapping.hasOwnProperty(cluster)) {
                            temp_mapping[cluster].push(entry);
                        }
                        else {
                            temp_mapping[cluster] = [entry];
                        }
                    });
                    for (name in temp_mapping) {
                        node_clusters["children"].push({"name":name, "children":temp_mapping[name]});
                    }
                    display_cluster();
                }
                else {
                    display();
                }

            }

            function showDetails(d,i, node) {
                data = d3.select(node).data()[0];
                content = "";
                if(typeof data["name"] != "string") {
                    data["name"] = data["name"]["first"] + " " + data["name"]["last"];
                    data["location"] = data["location"]["street"];
                }
                content += "<h1 class='main'>" + data["name"] + '</h1>';
                for(key in data["mapping"]){
                    if (data["mapping"][key] != "picture" && data["mapping"][key] != "name") {
                        content += "<p class='main'>" + data[data["mapping"][key]] + '</p>';
                    }
                }
                d3.select('#who').text(data["name"]);
                content += "<clipPath id='tooltip-image'><circle cx='106' cy='106' r='75'></circle></clipPath>";
                if("picture" in data){
                    content += '<svg width="200px" height="200px" style="margin-left:35px"><defs><clipPath id="myClip"><circle r="80" cx="60%" cy="50%"></circle></clipPath></defs><image x="10%" width="200" height="200" y="10" xlink:href="https://raw.githubusercontent.com/Adith/Graphene/master/data/profiles/'+data["picture"]+'"clip-path="url(#myClip)"></image></svg>';
                }
                else {
                    content += '<svg width="200px" height="200px" style="margin-left:35px"><defs><clipPath id="myClip"><circle r="80" cx="60%" cy="50%"></circle></clipPath></defs><image x="10%" width="200" height="200" y="10" xlink:href="https://raw.githubusercontent.com/Adith/Graphene/master/data/profiles/default_profile.jpg" clip-path="url(#myClip)"></image></svg>';   
                }
                showTooltip(content,d3.event);
            }
            // # Mouseout function
            function hideDetails(d,i) {
                hideTooltip();
            }

            var zoom = function(d) {
                    var focus0 = focus; focus = d;
                    var transition = d3.transition()
                        .duration(d3.event.altKey ? 7500 : 750)
                        .tween("zoom", function(d) {
                          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                          return function(t) { zoomTo(i(t)); };
                        });
                    var flag = true;
                    transition.selectAll("image")
                      .filter(function(d) { if(d == undefined ) {return false;} return d.parent === focus || this.style.display === "inline"; })
                        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                        .each("start", function(d) { if (d.parent !== focus) {this.style.display = "none"; } else { this.style.display = "inline"; } })
                        // .each("end", function(d) {  if (d.parent !== focus){ this.style.display = "inline"; console.log(this); } else {this.style.display = "none"; console.log(this);}});
                  };

            var zoomTo = function(v) {
                    var k = window.innerHeight / v[2]; view = v;
                    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
                    circle.attr("r", function(d) { return d.r * k; });
                  };

            function size_by_cluster_density(obj, root) {
              var profile_size = 145;
              root = root["children"];
              for(childID in root){
                for(childletID in root[childID]["children"]) {  
                  if(root[childID]["children"][childletID] == obj){
                    if(root[childID]["children"].length == 1) {
                      return 235;
                    }
                    else if(root[childID]["children"].length == 2) {
                      return 140;
                    }
                    return 145 - (root[childID]["children"].length - 2)*20;
                  }
                }
              }
              return 0;
            }

            var display_cluster = function() {
                var profile_size = 145;
                
                var color = d3.scale.linear()
                    .domain([-1, 5])
                    .range(["hsl(240,5%,8%)", "hsl(240,65%,45%)"])
                    .interpolate(d3.interpolateHcl);
                
                var pack = d3.layout.pack()
                    .padding(5)
                    .size([diameter - margin, diameter - margin])
                    .value(function(d) { return d.size; });
                
                var svg = d3.select("body").append("svg")
                    .attr("width", window.innerWidth - 15)
                    .attr("height", window.innerHeight -15);

                  var g = svg.append("g")
                  .attr("id","g")
                    .attr("transform", "translate(" + window.innerWidth / 2 + "," + window.innerHeight / 2 + ")");

                    // $("#g").append('<clippath id="clip"><circle cx="0" cy="0" r="75"></circle></clippath>');
                
                var root = node_clusters;
                
                  var focus = root,
                      nodes = pack.nodes(root),
                      view;
                node_data = []
                for (var k in nodes){
                    if(nodes[k]["picture"]) 
                        node_data.push(nodes[k]);
                }
                var element_id = -1;
                
                  circle = g.selectAll("g")
                      .data(nodes)
                    .enter().append("circle")
                      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
                      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
                  element_id = -1;
                  g.selectAll("image")
                      .data(node_data)
                    .enter().append("image").attr('width', function(e) {
                                  return 2*size_by_cluster_density(e,root);
                                })
                                .attr('height', function(e) {
                                  return 2*size_by_cluster_density(e,root);
                                })
                                .attr("x", function(e) {
                                  return -size_by_cluster_density(e,root);
                                })
                                .attr("y", function(e){
                                  return -size_by_cluster_density(e,root);
                                })
                                .attr('xlink:href', function(d) { 
                                  if(d.picture!=undefined) 
                                    return 'https://raw.githubusercontent.com/Adith/Graphene/master/data/profiles/'+d.picture; 
                                  else
                                    return 'https://raw.githubusercontent.com/Adith/Graphene/master/data/profiles/default_profile.jpg';
                                 })
                                .attr("clip-path", function(e) {
                                  var size = size_by_cluster_density(e,root);
                                  element_id = element_id + 1;
                                    var clipPath = g.append('clipPath').attr("id","clipPath-"+element_id);
                                    clipPath.append('ellipse').attr("id","image-"+element_id).attr("rx",size).attr("ry",size).attr("cx","0").attr("cy","0");
                                    return "url(#clipPath-"+element_id+")";
                                })
                      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 1; })
                      .style("display", function(d) { return d.parent === root ? "none" : "none"; })
                      .style('stroke', 'rgba(100, 100, 100, 0.2)')
                      .style('cursor', 'pointer')
                      .on('mouseover', function(e, i) {
                          showDetails(e, i, this);
                      })
                      .on('mouseout', function(e, i) {
                          hideDetails(e,i);
                          d3.select('#who').text('');
                      });
                      // var text = g.selectAll("circle").data(node_data).enter()
                      //             .append("text")
                      //             .attr("class", "label")
                      //             .text(function(d) { return d.name; });
                
                  node = svg.selectAll("circle,image");
                
                  d3.select("body")
                      .style("background", color(-1))
                      .on("click", function() { zoom(root); });
                
                  zoomTo([root.x, root.y, root.r * 2 + margin]);
                
                d3.select(self.frameElement).style("height", diameter + "px");

            } 

            var display = function() {

                // var node_data = [], lastNodeId, links = [], attributes, node_clusters = {};
                
                            d3.select('#next_link').style('display', 'none');
                d3.select('#graph').style('display', null);

                // Append an <svg> element to body for rendering (warning: SVG sucks and will
                // probably hang Firefox, so use Chrome).
                var svg = d3.select('#graph')
                    .append('svg')
                    .attr('width', window.innerWidth - 25)
                    .attr('height', window.innerHeight - 25);
                    // .attr('width', parseInt(d3.select('#graph').style('width'), 10))
                    // .attr('height', parseInt(d3.select('#graph').style('height'), 10));

                // Make a <g> tag for zoom purposes.
                var gPrime = svg.append('g');
                var g = svg.append('g');
                var profile_size = 25;
                
                // $.each(nodes, function(i,link){
                //     var clipPath = g.append('clipPath').attr("id","clipPath-"+i);
                //     clipPath.append('circle').attr("id","image-"+i).attr("cx",profile_size).attr("cy",profile_size).attr("r",profile_size);
                // });

                svg.call(d3.behavior.zoom().on('zoom', function() {
                    g.attr('transform',
                        'translate(' + d3.event.translate + ')'
                        + ' scale(' + d3.event.scale + ')');
                    gPrime.attr('transform',
                        'translate(' + d3.event.translate + ')'
                        + ' scale(' + d3.event.scale + ')');
                }));


                    var graph = {};
                        // Add some nodes to the graph.
                        graph.nodes = node_data;
                        graph.edges = links;


                            // Construct a mapping of friendships.
                            var friendships = graph.edges.reduce(function(acc, x) {
                                if (!Object.prototype.hasOwnProperty.call(acc, x.source)) {
                                    acc[x.source] = [];
                                }
                                if (!Object.prototype.hasOwnProperty.call(acc, x.target)) {
                                    acc[x.target] = [];
                                }
                                if (!~acc[x.source].indexOf(x.target)) {
                                    acc[x.source].push(x.target);
                                }
                                if (!~acc[x.target].indexOf(x.source)) {
                                    acc[x.target].push(x.source);
                                }

                                return acc;
                            }, {});

                            // Compute the maximum links from a node.
                            var maxFriends = Math.max.apply(Math, Object.keys(friendships).map(function(k) {
                                return friendships[k].length;
                            }));

                            // Compute the size for a node.
                            var sizeForNode = function(i) {
                                return Math.round(lerp(2, 10, (friendships[i] || [-1]).length / maxFriends));
                            };

                            // Create a force layout to display nodes.
                            var force = d3.layout.force()
                                .charge(-1000)
                                .linkDistance(275)
                                .size([parseInt(d3.select('#graph').style('width'), 10),
                                       parseInt(d3.select('#graph').style('height'), 10)])
                                .nodes(graph.nodes)
                                .links(graph.edges);

                            var paused = false;

                            d3.select('#pause').on('click', function() {
                                paused = !paused;
                                if (paused) {
                                    force.stop();
                                } else {
                                    force.resume();
                                }
                            });

                            // Add the edges to the SVG.
                            var edge = gPrime.selectAll('line.edge')
                                .data(graph.edges)
                                .enter().append('line')
                                .attr('class', 'edge')
                                .style('stroke', 'rgba(200, 200, 200, 0.2)')
                                .style('stroke-width', 2);

                            // Add the nodes to the SVG.
                            var node = g.selectAll('image.node')
                                .data(graph.nodes)
                                .enter().append('image')
                                .attr("clip-path", function(d){ 
                                    var id = d3.select(this).data()[0].id;
                                    var clipPath = g.append('clipPath').attr("id","clipPath-"+id);
                                    clipPath.append('circle').attr("id","image-"+id).attr("cx",profile_size).attr("cy",profile_size).attr("r",profile_size);
                                    return "url(#clipPath-"+id+")";
                                })
                                .attr("class", function(d) {
                                    if(attributes["overlay"])
                                    {
                                        if(d3.select(this).data()[0].__tags__.indexOf("active") > -1) {
                                            return "node "+d3.select(this).data()[0].__tags__;
                                        }
                                        else {
                                            return "node "+d3.select(this).data()[0].__tags__+" inactive";
                                        }
                                    }
                                    return "node "+d3.select(this).data()[0].__tags__;
                                })
                                .attr("id", function(d) {
                                    return "node-"+d3.select(this).data()[0].id;
                                })
                                .attr('width', 2*profile_size)
                                .attr('height', 2*profile_size)
                                .attr('xlink:href', function(d) {
                                    if("picture" in d3.select(this).data()[0]) {
                                        return "https://raw.githubusercontent.com/Adith/Graphene/master/data/profiles/"+d3.select(this).data()[0].picture;
                                    }
                                    else {
                                        return "https://raw.githubusercontent.com/Adith/Graphene/master/data/profiles/default_profile.jpg";
                                    }
                                    
                                })
                                .style('stroke', 'rgba(100, 100, 100, 0.2)')
                                .style('cursor', 'pointer')
                                .on('mouseover', function(d, i) {
                                    
                                    $("image").each(function(i){
                                        $(this).attr("class", $(this).attr("class")+" blur");
                                    });

                                    $(this).attr("class", $(this).attr("class").replace("blur","") + "focus");
                                    showDetails(d, i, this);
                                })
                                .on('mouseout', function(d, i) {
                                    hideDetails(d,i);
                                    d3.select('#who').text('');
                                    $("image").each(function(i){
                                      if ($(this).attr("class") != undefined)
                                        $(this).attr("class", $(this).attr("class").replace("blur","").replace("focus",""));
                                    });
                                    
                                })
                                .call(force.drag);

                            // Hook up some events to D3.js.
                            force.on('tick', function(e) {
                                node
                                    // .each(cluster(5 * e.alpha * e.alpha))
                                    // .each(collide(0.25))
                                    .attr('x', function(d) { $("#image-"+d.id).attr("cx",d.x); return d.x - profile_size; })
                                    .attr('y', function(d) { $("#image-"+d.id).attr("cy",d.y); return d.y - profile_size; });

                                edge.attr('x1', function(d) { return d.source.x; })
                                    .attr('y1', function(d) { return d.source.y; })
                                    .attr('x2', function(d) { return d.target.x; })
                                    .attr('y2', function(d) { return d.target.y; });
                            });
                            // Start the simulation.
                            force.start();
                        }