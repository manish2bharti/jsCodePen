
var compile = () => {
  var html = document.getElementById("html");
  var css = document.getElementById("css");
  var js = document.getElementById("js");
  var code = document.getElementById("code").contentWindow.document;
  code.open();
  code.writeln(
    html.value +
      "<style>" +
      css.value +
      "</style>" +
      "<script>" +
      js.value +
      "</script>"
  );
  var head = code.getElementsByTagName('head')[0];
  var script = code.createElement('script');
  script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
  script.type = 'text/javascript';
  head.appendChild(script);
  code.close();
  [].forEach.call(code.querySelectorAll("script"), function (el, idx) {
    document.getElementById("code").contentWindow.eval(el);
  });
}

// --------------- Modal Functionality Start ---------------------
var modal = document.getElementById("myModal");
var openSettings = (evt, view) => {
  modal.style.display = "block";
  openViewSettings(evt, view+'Settings');
}
var closeSettings = () => {
  modal.style.display = "none";
}
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// --------------- Modal Functionality End ---------------------

// --------------- Tabs Functionality Start ---------------------
var openViewSettings = (evt, view) => {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(view).style.display = "block";
  document.getElementsByClassName(view)[0].classList.add("active")
  // evt.currentTarget.className += " active";
}
// --------------- Tabs Functionality End ---------------------