//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");

require("component-responsive-frame/child");

var ich = require("icanhaz");
var tooltipTemplate = require("./_tooltipTemplate.html");
ich.addTemplate("tooltipTemplate", tooltipTemplate);

var percentiles = [
  { name: "20th", color: "#da2128" },
  { name: "40th", color: "#f57d20" },
  { name: "60th", color: "#2a9964" },
  { name: "80th", color: "#2384c6" },
  { name: "95th", color: "#524fa2" }
];

var width = 620;
var height = 310;
var chartHeight = height - 30;
var indexWidth = width / 7;
var indexHeight = chartHeight / 7;

var years = [2007, 2008, 2009, 2010, 2011, 2012, 2013];

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var render = function(index) {
  ctx.font = "14px helvetica";
  ctx.clearRect(0, 0, width, height); 

  // hover bars
  if (typeof index !== "undefined") {
    ctx.fillStyle = "rgb(248, 248, 248)";
    ctx.fillRect(index * indexWidth, 0, indexWidth, height);
  }

  // graph lines
  ctx.beginPath();
  ctx.strokeStyle = 'rgb(192, 192, 192)';
  ctx.lineWidth = 1;
  ctx.moveTo(0,0);
  ctx.lineTo(width, 0);
  for (var i = 1; i < 8; i++) {
    ctx.moveTo(0,indexHeight*i);
    ctx.lineTo(width, indexHeight*i);
  };
  ctx.stroke();

  // year labels
  var i = indexWidth/2;
  ctx.fillStyle = "rgb(66, 70, 72)";
  years.forEach(function(year){
    ctx.fillText(year, i - 15, height);
    i += indexWidth;
  });

  // data lines
  percentiles.forEach(function(percentile) {
    var points = [];
    years.forEach(function(year) {
      var point = data[percentile.name + " percentile"][year].percent;
      points.push(point);
    });

    ctx.beginPath();
    ctx.strokeStyle = percentile.color;
    ctx.lineWidth = 1.75;
    var i = indexWidth/2;
    points.forEach(function(point) {
      var y = indexHeight - (point * 20);
      ctx.lineTo(i, y);
      ctx.stroke();
      i += indexWidth;
    });
  });
};

render();

var tooltip = document.querySelector(".tooltip");

var onmove = function(e) {
  var indexWidth = canvas.offsetWidth / 6;

  if (e.target.tagName.toLowerCase() != "canvas") return;
  var position = {
    x: e.offsetX,
    y: e.offsetY
  };

  var index = Math.round(position.x / indexWidth);
  var year = (index + 2007).toString();
  tooltip.classList.add("show");
  tooltip.style.top = e.pageY + 20 + "px";
  tooltip.style.left = e.pageX + 10 + "px";

  var values = [];
  percentiles.forEach(function(percentile) {
    if (percentile) {
      var name = percentile.name + " percentile";
      var color = percentile.color;
      var income = data[percentile.name + " percentile"][year].income;
      values.push({
        name: name, color: color, income: income
      });
    }
  });

  render(index);

  tooltip.innerHTML = ich.tooltipTemplate({data: values});
};

canvas.addEventListener("mousemove", onmove);
canvas.addEventListener("click", onmove);
canvas.addEventListener("mouseout", function(e) {
  tooltip.classList.remove("show");
});