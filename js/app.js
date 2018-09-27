(function($) {
    $(document).ready(function() {

        // PROPIEDADES GLOBALES DEL LIENZO
        var lienzo = {
            $canvas: $('#canvas'),
            fillColorInicial: 'Yellow 500',
            strokeColorInicial: 'Orange 500',
            strokeTamanioInicial: 13,
            ultimo: new Image(),
            historial: [],
            deshacerHistorial: [],
            clicks: 0,
            isInicio: false,
            duracion: 0
        };

        // MAPEO DE LOS BOTONES
        var $$ = {
            borrar: $('#borrar'),
            guardar: $('#guardar'),
            deshacer: $('#deshacer'),
            rehacer: $('#rehacer'),
            herramientas: $('#herramientas'),
            pincel: $('#pincel'),
            flecha: $('#flecha'),
            linea: $('#linea'),
            multilinea: $('#multilinea'),
            rectangulo: $('#rectangulo'),
            cuadrado: $('#cuadrado'),
            elipse: $('#elipse'),
            circulo: $('#circulo'),
            poligono: $('#poligono'),
            numeroLados: $('#numero-lados'),
            fillColores: $('#fill-colores'),
            barra: $('#barra'),
            contenedor: $('#contenedor'),
            punto: $('#punto'),
            strokeColores: $('#stroke-colores')
        };

        // MAPEO ESTANDAR DE EVENTOS DE RATÓN A EVENTOS DE TOQUE
        var mapeoEventos = {
            'mousedown': 'touchstart',
            'mouseup': 'touchend',
            'mousemove': 'touchmove'
        };

        // ACTUALIZA EL TAMAÑO DEL CANVAS
        lienzo.actualizarTamanioCanvas = function() {

            var canvasImage = lienzo.$canvas.getCanvasImage('image/png');
            lienzo.canvasWidth = window.innerWidth;
            lienzo.canvasHeight = window.innerHeight;

            lienzo.$canvas.prop({
                width: lienzo.canvasWidth,
                height: lienzo.canvasHeight
            });

            lienzo.$canvas[0].getContext('2d').setTransform(1, 0, 0, 1, 0, 0);

            if (canvasImage.length > 10) {
                lienzo.$canvas.drawImage({
                    source: canvasImage,
                    x: 0,
                    y: 0,
                    fromCenter: false
                });
            }
        }

        // CONVIERTE UN EVENTO DE RATÓN A SU CORRESPONDIENTE EVENTO DE TOQUE
        lienzo.convierteEventoRatonEnEventoToque = function(nombreEvento) {
            if (window.ontouchstart !== undefined) {
                if (mapeoEventos[nombreEvento]) {
                    nombreEvento = mapeoEventos[nombreEvento];
                }
            }
            return nombreEvento;
        }

        // BORRA EL CANVAS
        lienzo.borrarCanvas = function() {
            lienzo.$canvas.drawRect({
                fillStyle: '#fff',
                x: 0,
                y: 0,
                width: lienzo.canvasWidth,
                height: lienzo.canvasHeight,
                fromCenter: false
            });
        }

        // DIBUJA EL ESTADO DEL CANVAS
        lienzo.dibujarEstadoDelCanvas = function(canvasImage) {
            lienzo.borrarCanvas();
            lienzo.$canvas.drawImage({
                source: canvasImage,
                x: 0,
                y: 0,
                fromCenter: false
            });
        }

        // ELEGIR HERRAMIENTA
        $$.herramientas.on('click', '.herramienta', function() {
            $$.herramientas.find('.herramienta-seleccionada').removeClass('herramienta-seleccionada');
            $(this).addClass('herramienta-seleccionada');
        });
        // BOTÓN BORRAR
        $$.borrar.on('click', function() {
            lienzo.$canvas.trigger('mouseup');
            lienzo.ultimo.src = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.historial.push(lienzo.ultimo.src);
            lienzo.borrarCanvas();
            lienzo.clicks = 0;
        });
        // BOTÓN GUARDAR
        $$.guardar.on('click', function() {
            var dataURL = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.$canvas.mouseup();
            window.open(dataURL);
        });
        // BOTÓN DESHACER
        $$.deshacer.on('click', function() {
            lienzo.$canvas.mouseup();
            if (lienzo.historial.length > 0) {
                lienzo.clicks = 0;
                lienzo.deshacerHistorial.push(lienzo.$canvas[0].toDataURL('image/png'));
                var last = lienzo.historial.pop();
                lienzo.dibujarEstadoDelCanvas(last);
            }
        });
        // BOTÓN REHACER
        $$.rehacer.on('click', function() {
            lienzo.$canvas.mouseup();
            if (lienzo.deshacerHistorial.length > 0) {
                lienzo.clicks = 0;
                var last = lienzo.deshacerHistorial.pop();
                lienzo.historial.push(lienzo.$canvas[0].toDataURL('image/png'));
                lienzo.dibujarEstadoDelCanvas(last);
            }
        });
        // BOTÓN HERRAMIENTA PINCEL
        $$.pincel.on('click', function() {
            lienzo.$canvas.herramientaPincel(lienzo);
        });
        // BOTÓN HERRAMIENTA FLECHA
        $$.flecha.on('click', function() {
            lienzo.ultimo.src = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.$canvas.herramientaFlecha(lienzo);
        });
        // BOTÓN HERRAMIENTA LÍNEA
        $$.linea.on('click', function() {
            lienzo.ultimo.src = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.$canvas.herramientaLinea(lienzo, false);
        });
        // BOTÓN HERRAMIENTA MULTILÍNEA
        $$.multilinea.on('click', function() {
            lienzo.ultimo.src = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.$canvas.herramientaLinea(lienzo, true);
        });
        // BOTÓN HERRAMIENTA RECTANGULO
        $$.rectangulo.on('click', function() {
            lienzo.ultimo.src = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.$canvas.herramientaRectangulo(lienzo, false);
        });
        // BOTÓN HERRAMIENTA CUADRADO
        $$.cuadrado.on('click', function() {
            lienzo.ultimo.src = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.$canvas.herramientaRectangulo(lienzo, true);
        });
        // BOTÓN HERRAMIENTA ELLIPSE
        $$.elipse.on('click', function() {
            lienzo.ultimo.src = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.$canvas.herramientaElipse(lienzo, false);
        });
        // BOTÓN HERRAMIENTA CÍRCULO
        $$.circulo.on('click', function() {
            lienzo.ultimo.src = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.$canvas.herramientaElipse(lienzo, true);
        });
        // BOTÓN HERRAMIENTA POLÍGONO
        $$.poligono.on('click', function() {
            lienzo.ultimo.src = lienzo.$canvas[0].toDataURL('image/png');
            lienzo.$canvas.herramientaPoligono(lienzo, $$.numeroLados);
        });
        // HERRAMIENTE POR DEFECTO
        $$.pincel.click();

        // PINTAR COLORES
        lienzo.pintarColores = function(nombreCapa) {
            var c, s;
            for (s = 0; s < sombrasColores.length; s += 1) {
                for (c = 0; c < nombresColores.length; c += 1) {
                    lienzo.pintaColor(nombresColores[c], sombrasColores[s], nombreCapa);
                }
                $('<br />').appendTo("#"+nombreCapa);
            }
        }

        // PINTAR UN COLOR
        lienzo.pintaColor = function(color, shade, nombreCapa) {
            var colorShade = color + ' ' + shade;
            var colorSeleccionado = "";
            if (nombreCapa === "fill-colores" && lienzo.fillColorInicial === colorShade) {
              colorSeleccionado = "color-seleccionado";
            } else if (nombreCapa === "stroke-colores" && lienzo.strokeColorInicial === colorShade) {
              colorSeleccionado = "color-seleccionado";
            }
            if (colores[color] && colores[color][shade]) {
                $('<div class="color ' + colorShade + ' ' + nombreCapa + ' ' + colorSeleccionado + '" />')
                    .css({
                        backgroundColor: colores[color][shade]
                    })
                    .appendTo("#"+nombreCapa);
            }
        }

        // ACTUALIZA CIRCULO
        lienzo.actualizarCirculo = function() {
            $$.punto.css({
                width: lienzo.strokeTamanio,
                height: lienzo.strokeTamanio,
                marginLeft: ($$.contenedor.width() - $$.punto.width()*2) / 2,
                marginTop: ($$.contenedor.height() - $$.punto.height()*2) / 2
            });
            if (!lienzo.isInicio) {
                $$.punto.css({
                    backgroundColor: lienzo.fillColor,
                    borderColor: lienzo.strokeColor,
                    borderWidth: lienzo.strokeTamanio / 2
                });
            } else {
                $$.punto.stop().animate({
                    backgroundColor: lienzo.fillColor,
                    borderColor: lienzo.strokeColor,
                    borderWidth: lienzo.strokeTamanio / 2
                }, lienzo.duracion);
            }
            lienzo.isInicio = true;
        }

        // CONVIERTE EL NOMBRE DE COLOR EN RGB
        lienzo.convierteNombreColorEnRGB = function(color) {
            var nombreColor = color.split(' ');
            var elementoColor = $('.' + nombreColor[0] + '.' + nombreColor[1] + '.' + nombreColor[2]);
            elementoColor.addClass('color-seleccionado');
            return elementoColor.css('backgroundColor');
        }

        // CONVIERTE EL NOMBRE DE COLOR FILL EN RGB
        lienzo.convierteNombreColorFillEnRGB = function(color) {
            lienzo.fillColor = this.convierteNombreColorEnRGB(color + " fill-colores");
            lienzo.actualizarCirculo();
        }

        // CONVIERTE EL NOMBRE DE COLOR STROKE EN RGB
        lienzo.convierteNombreColorsStrokeEnRGB = function(color) {
            lienzo.strokeColor = this.convierteNombreColorEnRGB(color + " stroke-colores");
            lienzo.actualizarCirculo();
        }

        // RELLENAR EL STROKE
        lienzo.rellenarStroke = function(porcentaje) {
            var barraWidth = $$.barra.width();
            var strokePunto = $$.barra.children('#filler');
            var strokePuntoBorde = (barraWidth * (porcentaje / 100));
            strokePunto.css({
                borderWidth: strokePuntoBorde
            });
        }

        // ELEGIR COLOR DEL FILL
        lienzo.pintarColores('fill-colores');
        lienzo.convierteNombreColorFillEnRGB(lienzo.fillColorInicial);
        $$.fillColores.on('click', '.color', function() {
            var $fillColor = $(this);
            $('.color.color-seleccionado.fill-colores').removeClass('color-seleccionado');
            lienzo.convierteNombreColorFillEnRGB($fillColor.prop('class').replace(/(color|color-seleccionado) /gi, ''));
            $fillColor.addClass('color-seleccionado');
            lienzo.clicks = 0;
            return false;
        });

        // ELEGIR COLOR DEL STROKE
        lienzo.pintarColores('stroke-colores');
        lienzo.convierteNombreColorsStrokeEnRGB(lienzo.strokeColorInicial);
        $$.strokeColores.on('click', '.color', function() {
            var $strokeColor = $(this);
            $('.color.color-seleccionado.stroke-colores').removeClass('color-seleccionado');
            lienzo.convierteNombreColorsStrokeEnRGB($strokeColor.prop('class').replace(/(color|color-seleccionado) /gi, ''));
            $strokeColor.addClass('color-seleccionado');
            lienzo.clicks = 0;
            return false;
        });

        // BARRA DEL STROKE
        $$.barra.slider({
            min: 2,
            value: 50
        });
        var valorInicialTamanioStroke = $$.barra.slider('option', 'value');
        lienzo.strokeTamanio = Math.round(valorInicialTamanioStroke / 4);
        lienzo.rellenarStroke(valorInicialTamanioStroke);
        lienzo.actualizarCirculo();

        // SLIDE PARA CAMBIAR EL STROKE
        $$.barra.bind('slide', function(event, ui) {
            var porcentaje = ui.value;
            lienzo.strokeTamanio = Math.round(porcentaje / 4);
            lienzo.rellenarStroke(porcentaje);
            lienzo.actualizarCirculo();
        });

        lienzo.actualizarTamanioCanvas();
        lienzo.borrarCanvas();

        $(window).bind('resize', lienzo.actualizarTamanioCanvas);

    });
}(jQuery));
