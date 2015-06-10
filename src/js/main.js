//Use CommonJS style via browserify to load other modules
// require("./lib/social");
// require("./lib/ads");

require("component-responsive-frame/child");

var years = [2007, 2008, 2009, 2010, 2011, 2012, 2013];
var percentiles = [
  {
    name: "20th",
    color: "red"
  },
  {
    name: "40th",
    color: "orange"
  },
  {
    name: "60th",
    color: "yellow"
  },
  {
    name: "80th",
    color: "green"
  },
  {
    name: "95th",
    color: "blue"
  }
];

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
  var i = 0;
  points.forEach(function(point) {
    var y = 100 - (point * 20);
    ctx.lineTo(i, y);
    ctx.stroke();
    i += 100;
  });
})

// var values = [];
// var items = years.map(function(year) {
//   var value = data["20th percentile"][year];
//   if (value) values.push(value);
//   // return {
//   //   value: value,
//   //   year: year.replace("year-", "")
//   // }
// });
// var penDown = false;
// var max = Math.max.apply(null, values);
// var min = Math.min.apply(null, values);
// context.clearRect(0, 0, canvas.width, canvas.height);
// context.beginPath();
// context.strokeStyle = "#D8761B";
// context.lineWidth = 1.5;
// var padding = 3;
// var top = canvas.height - padding;
// var left = padding;
// var height = canvas.height - padding * 2;
// var width = canvas.width - padding * 2;
// items.forEach(function(item, i) {
//   if (!item.value) return;
//   var x = width / (years.length - 1) * i + padding;
//   var y = top - ((item.value - min) / (max - min) * height);
//   context[penDown ? "lineTo" : "moveTo"](x, y);
//   penDown = true;
// });
// context.moveTo(0, 0);
// if (penDown) context.stroke();
// context.closePath();
// if (position) {
//   context.fillStyle = "rgba(0, 0, 0, .5)";
//   context.beginPath();
//   var segment = width / (years.length - 1);
//   var index = Math.round(position.x / segment);
//   var item = items[index];
//   var y = top - ((item.value - min) / (max - min) * height);
//   context.arc(index * segment + padding, y, 3, 0, Math.PI * 2);
//   context.fill();
//   return item;
// };