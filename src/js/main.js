//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");

require("component-responsive-frame/child");

var ich = require("icanhaz");
var tooltipTemplate = require("./_tooltipTemplate.html");
ich.addTemplate("tooltipTemplate", tooltipTemplate);

var percentiles = [
  { name: "95th", color: "82,79,162" },
  { name: "80th", color: "35,132,198" },
  { name: "60th", color: "42,153,100" },
  { name: "40th", color: "245,125,32" },
  { name: "20th", color: "218,33,40" }
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
var ctx = canvas.getContext("2d");

var render = function(index) {
  ctx.clearRect(0, 0, width, height); 

  // hover bars
  if (typeof index !== "undefined") {
    ctx.fillStyle = "rgb(248, 248, 248)";
    ctx.fillRect(index * indexWidth + leftOffset, topOffset, indexWidth, height);
    ctx.fillStyle = "rgb(199, 187, 220)";
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
  ctx.fillText("Income change", -(chartHeight/2 + topOffset), 0);
  ctx.rotate((Math.PI/180)*90);

  // data lines
  percentiles.forEach(function(percentile) {
    var points = [];
    years.forEach(function(year) {
      var point = data[percentile.name + " percentile"][year].percent;
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
  if (e.offsetX) {
    position = {
      x: e.offsetX,
      y: e.offsetY
    };
  } else {
    var bounds = canvas.getBoundingClientRect();
    position = {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    };
  }

  var index = Math.floor((position.x - leftOffset)/ indexWidth);
  var year = (index + 2007).toString();

  if (index >= 0) { 
    tooltip.classList.add("show");
    tooltip.style.top = e.pageY + 20 + "px";
    tooltip.style.left = e.pageX + 10 + "px";

    var values = [];
    percentiles.forEach(function(percentile) {
      if (percentile) {
        var name = percentile.name;
        var color = percentile.color;
        var income = data[percentile.name + " percentile"][year].income;
        var percent = data[percentile.name + " percentile"][year].percent;
        values.push({
          name: name, color: color, income: income, percent: percent
        });
      }
    });

    render(index);

    tooltip.innerHTML = ich.tooltipTemplate({data: values});
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