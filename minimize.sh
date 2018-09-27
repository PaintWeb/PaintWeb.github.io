#! /bin/bash


concatCSS() {

  echo $1
  echo "/* MINIMIZE "$1" */" >> css/minimize.css
  cat $1 >> css/minimize.css
}

concatJS() {

  echo $1
  echo "/* MINIMIZE "$1" */" >> js/minimize.js
  cat $1 >> js/minimize.js

}

# CSS

echo "" > css/minimize.css

concatCSS lib/css/reset.css
concatCSS lib/css/font-awesome.min.css
concatCSS lib/css/fontroboto-regular.css
concatCSS css/estilos.css

# JS

echo "" > js/minimize.js

concatJS lib/js/modernizr.js
concatJS lib/js/jquery.js
concatJS lib/js/jquery-ui.js
concatJS lib/js/jcanvas.js
concatJS lib/js/fastclick.js
concatJS js/colores.js
concatJS js/app.js
concatJS js/herramientas/pincel.js
concatJS js/herramientas/lineas.js
concatJS js/herramientas/rectangulo.js
concatJS js/herramientas/elipse.js
