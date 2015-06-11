//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");

require("component-responsive-frame/child");

var ich = require("icanhaz");
var tooltipTemplate = require("./_tooltipTemplate.html");
ich.addTemplate("tooltipTemplate", tooltipTemplate);

var percentiles = [
  { name: "20th", color: "#ca6951" },
  { name: "40th", color: "#f89e5d" },
  { name: "60th", color: "#e3a51d" },
  { name: "80th", color: "#798f71" },
  { name: "95th", color: "#8ca2d4" }
];

var indexWidth = 100;

var years = [2007, 2008, 2009, 2010, 2011, 2012, 2013];

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

percentiles.forEach(function(percentile) {
  var points = [];
  years.forEach(function(year) {
    var point = data[percentile.name + " percentile"][year].percent;
    points.push(point);
  });

  ctx.beginPath();
  ctx.strokeStyle = percentile.color;
  ctx.lineWidth = 1.5;
  var i = 0;
  points.forEach(function(point) {
    var y = 100 - (point * 20);
    ctx.lineTo(i, y);
    ctx.stroke();
    i += indexWidth;
  });
});

var tooltip = document.querySelector(".tooltip");

var onmove = function(e) {
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

  var index = (Math.round(position.x / indexWidth) + 2007).toString();
  tooltip.classList.add("show");
  tooltip.style.top = e.pageY + 20 + "px";
  tooltip.style.left = e.pageX + 10 + "px";

  var values = [];
  percentiles.forEach(function(percentile) {
    if (percentile) {
      var name = percentile.name + " percentile";
      var color = percentile.color;
      var income = data[percentile.name + " percentile"][index].income;
      values.push({
        name: name, color: color, income: income
      });
    }
  });

  tooltip.innerHTML = ich.tooltipTemplate({data: values});
};

canvas.addEventListener("mousemove", onmove);
canvas.addEventListener("click", onmove);
canvas.addEventListener("mouseout", function(e) {
  tooltip.classList.remove("show");
});