includeFile = function() {
  let elems, i, element, file, xhttp;
  elems = document.getElementsByTagName("*");
  for (i = 0; i < elems.length; i++) {
    element = elems[i];
    file = element.getAttribute("include");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {element.innerHTML = this.responseText;}
          if (this.status == 404) {element.innerHTML = "Le fichier n'a pas été trouvé !";}
          element.removeAttribute("include");
          includeFile();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
}
};
