function drawBarChart(target, styles, data, labels, verticalAxis) //types: "baseline", "capped", "overlapping", "quadratic", "rounded", "triangle", "zero"
{
    var height = 200,
        barWidth = 60,
        axisWidth = 2,
        blockHeight = 30,
        xPaddingSVG = 120,
        yPaddingSVG = 100,
        barSpacing = 20,
        radius = (barWidth - barSpacing) / 2;

    var y = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0]);

    var canvas = d3.select(target)
        .attr("width", barWidth * data.length + xPaddingSVG)
        .attr("height", height + yPaddingSVG);

    var defs = canvas.append("defs").attr("id", "clip");

    var chart = canvas.append("g")
        .attr("id", "chart")
        .attr("transform", "translate(0," + yPaddingSVG / 2 + ")");

    var bar = chart.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("id", "bar")
        .attr("transform", function(d, i) {
            return "translate(" + ((i * barWidth) + ((xPaddingSVG / 3) * 2)) + ", 0)";
        });


    // Baseline Bars
    if (styles.style == "baseline") {
        bar.append("rect")
            .attr("y", function(d) {
                return y(d)
            })
            .attr("width", barWidth - barSpacing)
            .attr("height", function(d) {
                return height - y(d)
            })
            .attr("fill", "#000000");

    }

    //Scaled Bars
    if (styles.style == "stretch") {
        var imported = bar.append("g").attr("id", "imported");
        d3.xml(styles.path, "image/svg+xml", function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            canvas.selectAll("#imported")
                .each(function(d, i) {
                    var plane = this.appendChild(importedNode.cloneNode(true));
                })
        });

        imported.attr("transform", function(d) {
            return "translate(0, " + y(d) + ") scale(1, " + (height - y(d)) / height + ")"
        });
    }

    //Shifted Bars
    if (styles.style == "move") {
        var imported = bar.append("g").attr("id", "imported");
        d3.xml(styles.path, "image/svg+xml", function(xml) {
            var importedNode = document.importNode(xml.documentElement, true);
            canvas.selectAll("#imported")
                .each(function(d, i) {
                    var plane = this.appendChild(importedNode.cloneNode(true));
                })
        });

        imported.attr("transform", function(d) {
            return "translate(0, " + y(d) + ")"
        });
    }

    // Mask below X Axis
    bar.append("rect")
        .attr("height", 60)
        .attr("width", 60)
        .attr("x", 0)
        .attr("y", height)
        .attr("fill", "#FFFFFF");

    // Axes
    // Bar Labels
    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", height + 15)
        .attr("dx", ".35em")
        .attr("fill", "#000000")
        .attr("text-anchor", "end")
        .text(function(d, i) {
            //return labels[i] + data[i];
            return labels[i];
        });

    // bar.append("circle")
    //     .attr("cx", (barWidth - barSpacing) / 2)
    //     .attr("cy", height + 15)
    //     .attr("r", 5)
    //     .attr("fill", "#FF0000");

    // X Axis
    chart.append("line")
        .attr("class", "x axis")
        .attr("x1", (axisWidth + xPaddingSVG) / 3)
        .attr("y1", height)
        .attr("x2", barWidth * data.length + xPaddingSVG - barSpacing)
        .attr("y2", height)
        .attr("stroke-width", axisWidth)
        .attr("stroke", "#000000");
    //Y Axis
    if (verticalAxis) {
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(1);

        chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (axisWidth + xPaddingSVG) / 3 + ", 0)")
            .attr("stroke-width", axisWidth)
            .call(yAxis);
    }
}

function chooseType(counter, offset, contig) {
    var types = ["baseline", "capped", "overlapping", "quadratic", "rounded", "triangle", "zero"];
    if (Math.floor(counter / contig) == 0) {
        done[offset % 5] = true;
        return types[offset % 5];
    } else if ((counter / contig) % 1 == 0) {
        position = offset % 5;
        while (done[position] == true) {
            position = Math.round(Math.random() * 4);
        }
        done[position] = true;
        return types[position];
    } else {
        return types[position];
    }
    //    return types[(Math.floor(counter / contig) + offset) % 7];
}

function makeData() {
    // return [100, 10, 0];
    return [Math.floor(Math.random() * 95) + 3, Math.floor(Math.random() * 95) + 3, Math.floor(Math.random() * 95) + 3];
}

function padAxis(data) {
    var dataMax = d3.max(data);
    var places = 0;
    var counter = dataMax;
    while (counter > 1) {
        counter = counter / 10;
        places++;
    }
    var multiplier = Math.pow(10, (places - 1));
    return Math.ceil(dataMax / multiplier) * multiplier;
}