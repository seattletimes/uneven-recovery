var ich = require("icanhaz");
var tooltipTemplate = require("./_tooltipTemplate.html");
ich.addTemplate("tooltipTemplate", tooltipTemplate);

var percentiles = [
  { name: "95th", color: "29,49,75" },
  { name: "80th", color: "120,122,140" },
  { name: "60th", color: "176,176,187" },
  { name: "40th", color: "236,196,192" },
  { name: "20th", color: "200,34,76" }
];

var width = 620;
var height = 320;
var leftOffset = 48;
var topOffset = 5;
var chartHeight = 280;
var chartWidth = width - leftOffset;
var indexWidth = chartWidth / 7;
var indexHeight = chartHeight / 7;

var years = [2007, 2008, 2009, 2010, 2011, 2012, 2013];

var canvas = document.querySelector("canvas");
if (canvas) {
  var ctx = canvas.getContext("2d");

  var render = function(index) {
    ctx.clearRect(0, 0, width, height); 

    // hover bars
    if (typeof index !== "undefined") {
      ctx.fillStyle = "rgb(248, 248, 248)";
      ctx.fillRect(index * indexWidth + leftOffset, topOffset, indexWidth, height);
      ctx.fillStyle = "rgba(176,176,187,.6)";
      ctx.fillRect(index * indexWidth + leftOffset, height-35, indexWidth, height);
    }

    // graph lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(192, 192, 192)';
    ctx.lineWidth = 1;
    ctx.moveTo(leftOffset, topOffset);
    ctx.lineTo(chartWidth + leftOffset, topOffset);
    for (var i = 1; i < 8; i++) {
      ctx.moveTo(leftOffset,indexHeight*i + topOffset);
      ctx.lineTo(chartWidth + leftOffset, indexHeight * i + topOffset);
    };
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(126, 131, 139)';
    ctx.lineWidth = 2;
    ctx.moveTo(leftOffset, indexHeight + topOffset);
    ctx.lineTo(chartWidth + leftOffset, indexHeight + topOffset);
    ctx.stroke();

    // year labels
    var i = indexWidth/2 + leftOffset;
    ctx.font = "bold 14px helvetica";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(66, 70, 72)";
    years.forEach(function(year){
      ctx.fillText(year, i, height - 18);
      i += indexWidth;
    });

    // percent labels
    var percent = 2;
    ctx.font = "12px helvetica";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgb(66, 70, 72)";
    for (var i = 0; i < 8; i++) {
      ctx.fillText(percent + "%", 43, indexHeight * i + topOffset);
      percent -= 2;
    };

    // percent label name
    ctx.rotate(-(Math.PI/180)*90);
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    ctx.font = "13px helvetica";
    ctx.fillText("Income change from 2007", -(chartHeight/2 + topOffset), 0);
    ctx.rotate((Math.PI/180)*90);

    // data lines
    percentiles.forEach(function(percentile) {
      var points = [];
      years.forEach(function(year) {
        var point = incomeData[percentile.name + " percentile"][year].percent;
        points.push(point);
      });

      ctx.beginPath();
      ctx.strokeStyle = "rgb(" + percentile.color + ")";
      ctx.lineWidth = 1.75;
      var i = indexWidth/2 + leftOffset;
      points.forEach(function(point) {
        var y = indexHeight - (point * 20) + topOffset;
        ctx.lineTo(i, y);
        ctx.stroke();
        i += indexWidth;
      });
    });
  };

  render();

  var tooltip = document.querySelector(".tooltip");

  var onmove = function(e) {
    var indexWidth = (canvas.offsetWidth - leftOffset) / 7;

    if (e.target.tagName.toLowerCase() != "canvas") return;
    var position;
    var bounds = canvas.getBoundingClientRect();
    position = {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    };

    var index = Math.floor((position.x - leftOffset)/ indexWidth);
    var year = (index + 2007).toString();

    if (index >= 0) { 
      tooltip.classList.add("show");

      var values = [];
      percentiles.forEach(function(percentile) {
        console.log(percentile)
        if (percentile) {
          var name = percentile.name;
          var color = percentile.color;
          var income = incomeData[percentile.name + " percentile"][year].income;
          var percent = incomeData[percentile.name + " percentile"][year].percent;
          if (!percent == 0) {
            var up = percent > 0;
            var down = percent < 0;
            var formattedPercent = percent.toString().replace("-", "");
          }
          values.push({
            name: name, 
            color: color, 
            income: income, 
            percent: formattedPercent,
            up: up,
            down: down,
            bold: percentile.name == "95th" || percentile.name == "20th"
          });
        }
      });

      render(index);

      tooltip.innerHTML = ich.tooltipTemplate({year: year, data: values});

      var tBounds = tooltip.getBoundingClientRect();
      var y = position.y < (bounds.height/2) ? 20 : -tBounds.height - 20;
      var x = position.x < (bounds.width/2) ? 20 : -tBounds.width - 20;
      tooltip.style.top = e.pageY + y + "px";
      tooltip.style.left = e.pageX + x + "px";
    } else {
      tooltip.classList.remove("show");
    }
  };

  canvas.addEventListener("mousemove", onmove);
  canvas.addEventListener("click", onmove);
  canvas.addEventListener("mouseout", function(e) {
    render();
    tooltip.classList.remove("show");
  });
}