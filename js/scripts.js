$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

//capture all click events and return their id as strings.

document.addEventListener('click', function(e) {
   // user enter tempreature value
    var tempreaturevalue = document.getElementsByClassName('tempreaturevalue');
    // calculated tempreature value 
    var convertedvalue = document.getElementsByClassName('convertedvalue');
    
    switch (e.target.id) {
    case "convert-to-fahrenheit-button":
        
           
         if (tempreaturevalue[0].value === "")  {
            alert("Please Enter Value !"); 
             } 
        else {
            convertedvalue[0].value = converttofahrenheit(tempreaturevalue[0].value) + " F"; 
            }    
      
        break;
   
}
    
});
    

var canvasmap, svg;

var data = { 
    nodes: [], 
    paths: [], 
    distances: [],
    state: { 
        selectedNode: null,
        fromNode: null,
        toNode: null
    },
    ui: { 
        inputSelectSourceNode: "#from",
        inputSelectTargetNode: "#to"
    }
};

var dragManager = d3.behavior.drag()
    .on('dragstart', dragNodeStart())
    .on('drag', dragNode())
    .on('dragend', dragNodeEnd());

$(function() { 

    graph = d3.select('#graph');

    svg = canvasmap.append("svg:svg")
        .attr("id", "svg")
        .attr("class", "graph")
        .attr("width", 800)
        .attr("height", 800)
        .on("click", nullEventHandler("svg:click"))
        .on("contextmenu", function() { d3.event.preventDefault(); })
        .on("dblclick", addNode);

    initUI();

});



function dijkstra(start, end) { 
    
        var nodeCount = data.distances.length,
            infinity = 99999, // larger than largest distance in distances array
            shortestPath = new Array(nodeCount),
            nodeChecked = new Array(nodeCount),
            pred = new Array(nodeCount);
    
        // initialise data placeholders
    
        for (var i = 0; i < nodeCount; i++) {
            shortestPath[i] = infinity;
            pred[i] = null;
            nodeChecked[i] = false;
        }
    
        shortestPath[start] = 0;
    
        for (var i = 0; i < nodeCount; i++) {
    
            var minDist = infinity;
            var closestNode = null;
    
            for (var j = 0; j < nodeCount; j++) {
    
                if (!nodeChecked[j]) {
                    if (shortestPath[j] <= minDist) {
                        minDist = shortestPath[j];
                        closestNode = j;
                    }
                }
            }
    
            nodeChecked[closestNode] = true;
    
            for (var k = 0; k < nodeCount; k++) {
                if (!nodeChecked[k]) {
                    var nextDistance = distanceBetween(closestNode, k, data.distances);
                    if ((parseInt(shortestPath[closestNode]) + parseInt(nextDistance)) < parseInt(shortestPath[k])) {
                        soFar = parseInt(shortestPath[closestNode]);
                        extra = parseInt(nextDistance);
                        shortestPath[k] = soFar + extra;
                        pred[k] = closestNode;
                    }
                }
            }
    
        }
    
        if (shortestPath[end] < infinity) {
    
            var newPath = [];
            var step = {
                target: parseInt(end)
            };
    
            var v = parseInt(end);
    
            while (v >= 0) {
                v = pred[v];
                if (v !== null && v >= 0) {
                    step.source = v;
                    newPath.unshift(step);
                    step = {
                        target: v
                    };
                }
            }
    
            totalDistance = shortestPath[end];
    
            return {
                mesg: 'OK',
                path: newPath,
                source: start,
                target: end,
                distance: totalDistance
            };
        } else {
            return {
                mesg: 'No path found',
                path: null,
                source: start,
                target: end,
                distance: 0
            };
        }
    
        function distanceBetween(fromNode, toNode, distances) { 
            dist = distances[fromNode][toNode];
            if (dist === 'x') dist = infinity;
            return dist;
        }
    
    };

