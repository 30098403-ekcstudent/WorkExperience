function codeOne() {
    var1.innerHTML = "DOM1 Code works!"
} // this replaces the first line's text with "DOM1 Code works!" when pressed.

function codeTwo() {
    var2.innerHTML = "DOM2 Code works!"
} // this replaces the second line's text with "DOM2 Code works!" when pressed.


let var1 = document.getElementById("DOM1");
let var2 = document.getElementById("DOM2");
let button = document.getElementById("button");
// this assigns separate variables to the corresponding lines.

button.onclick = codeOne // DOM1 Code that calls the function "CodeOne" when the button is pressed.
button.addEventListener("click", codeTwo); //DOM2 Code that calls the function "CodeTwo" when the button is pressed.