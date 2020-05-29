
parent.document.getElementById('debugDiv').style.display = "none";

var htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlEditor"), {
  lineNumbers : true,
  matchBrackets : true,
  tabMode: "indent",
  mode:  "htmlmixed",
  htmlMode: true,
  theme: 'monokai'
});

var cssEditor = CodeMirror.fromTextArea(document.getElementById("cssEditor"), {
  lineNumbers : true,
  matchBrackets : true,
  tabMode: "indent",
  mode:  "css",
  htmlMode: true,
  theme: 'monokai'
});

var jsEditor = CodeMirror.fromTextArea(document.getElementById("jsEditor"), {
  lineNumbers : true,
  matchBrackets : true,
  tabMode: "indent",
  mode:  "javascript",
  htmlMode: true,
  theme: 'monokai'
});

var compile = () => {
  var html = document.getElementById("html");
  var css = document.getElementById("css");
  var js = document.getElementById("js");
  parent.document.getElementById('debugDiv').innerHTML = "";
  parent.document.getElementById('debugDiv').style.display = "none";
  var code = document.getElementById("code").contentWindow.document;
  code.open();
  code.writeln(
    htmlEditor.getValue() +
      "<style>" +
      cssEditor.getValue() +
      "</style>" +
      "<script> window.onerror = function(message, url, line, col, errorObj) { parent.document.getElementById('debugDiv').innerHTML += `${message}\n${url}, ${line}:${col} '<br />`; parent.document.getElementById('debugDiv').style.display = 'block';}; </script>"+
      "<script>" +
      jsEditor.getValue() +
      "</script>"
  );

  var head = code.getElementsByTagName('head')[0];
  // Inject external CSS files in iframe
  if(addedExternalResources.cssResources.length){
    var resources = addedExternalResources.cssResources;
    resources.forEach(function(item, index){
      var link = code.createElement('link');
      link.href = item; //https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
      link.type = 'text/css';
      link.rel = "stylesheet";
      link.onerror = (error) => {
        var error = `Invalid External Stylesheet Url: ${error.currentTarget.src}`;
        document.getElementById('debugDiv').innerHTML += error + '<br />';
        document.getElementById('debugDiv').style.display = 'block';
      }
      head.appendChild(link); 
    })
  }

  // Inject external JS files in iframe
  if(addedExternalResources.jsResources.length){
    var resources = addedExternalResources.jsResources;
    resources.forEach(function(item, index){
      var script = code.createElement('script');
      script.src = item; //https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
      script.type = 'text/javascript';
      script.onerror = (error) => {
        var error = `Invalid External JS Url: ${error.currentTarget.src}`;
        document.getElementById('debugDiv').innerHTML += error + '<br />';
        document.getElementById('debugDiv').style.display = 'block';
      }
      head.appendChild(script); 
    })
  }

  code.close();
  [].forEach.call(code.querySelectorAll("script"), function (el, idx) {
    document.getElementById("code").contentWindow.eval(el);
  });
  [].forEach.call(code.querySelectorAll("link"), function (el, idx) {
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


// --------------- Add resources Functionality Start ---------------------
var i = 1;

function addResource(containerId, type) {
    i++;
    var div = document.createElement('div');
    var id=++document.querySelectorAll('#jsResources input[type=text]')[document.querySelectorAll('#jsResources input[type=text]').length-1].name.split("_")[1];

    div.innerHTML = `Resource ${id} : <input type="text" name="${type}_${id}"/>
    <input type="button" id="add_${type}()_${id}" onclick="addResource('${containerId}','${type}')" value="+" />
    <input type="button" id="rem_${type}()_${id}" onclick="removeResource(this, '${containerId}')" value="-" />`;

    document.getElementById(containerId).appendChild(div);
}

function removeResource(div, containerId) {
  document.getElementById(containerId).removeChild(div.parentNode);
  i--;
}

var addedExternalResources = {
  'jsResources': [],
  'cssResources': []
}
function captureResponse(type){
  addedExternalResources[type] = [];
  for(var j=0;j<document.querySelectorAll('#'+type+' input[type=text]').length;j++){
    addedExternalResources[type].push(document.querySelectorAll('#'+type+' input[type=text]')[j].value);
  }
  addedExternalResources[type] = addedExternalResources[type].filter(function(el) { return el; });
}

// --------------- Add resources Functionality End ---------------------
