let seconds = 1.2;
let i = 0;
let colors = ["#ff8c1a", "#80bfff", "#f11334", "#ffff66", "#99ccff", "#0505ad", "#e9afe9"];
let squares = document.getElementsByClassName("square");

for(j = 0; j < squares.length; j ++) {
  squares[j].style.marginLeft = (j * 150).toString() + "px";
}

setInterval(function changeColor () {
    if(i>=7) {i = 0};
      for(j = 0; j < squares.length; j ++) {
      	squares[j].style.backgroundColor = colors[i];
      }
  	i++;
  }, seconds * 1000);



//get array of circle, toggle visibility
// with visibility:hidden
// ima neki error al eto
let seconds2 = 0.3;
var circles = document.getElementsByClassName("circle");
let len = circles.length;
let k = 0;
toggleToggle = false;

// console.log(len);

setInterval(function show() {

	if(!toggleToggle) {
      if(k < len-1) {
        circles[k].style.visibility = "visible";
        k++;
      }
      else {
        circles[k].style.visibility = "visible";
        toggleToggle = true;
      }
    }
  else {
    if(k >= 1) {
      circles[k].style.visibility = "hidden";
      k--;
    }
    else {
      circles[k].style.visibility = "hidden";
      toggleToggle = false;
    }
  }
}, seconds2 * 1000);
