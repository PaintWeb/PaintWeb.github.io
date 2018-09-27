(function($) {
    $.fn.herramientaLinea = function(lienzo, isMultilinea) {

        // VARIABLES
        var $canvas = this;
        $canvas.unbind();
        lienzo.clicks = 0;
        var xIni, yIni, xEnd, yEnd, xControl, yControl, xDrag, yDrag;

        // DIBUJAMOS LA LINEA
        var dibujarLinea = function() {
            $canvas.drawLine({
                strokeWidth: lienzo.strokeTamanio,
                strokeStyle: lienzo.strokeColor,
                strokeCap: 'round',
                strokeJoin: 'round',
                x1: xIni,
                y1: yIni,
                x2: xEnd,
                y2: yEnd,
            });
        };

        // EMPEZAMOS A DIBUJAR CUANDO SE PRESIONA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mousedown'), function(event) {
            if (isMultilinea || lienzo.clicks === 0) {
                lienzo.historial.push(lienzo.ultimo.src = $canvas[0].toDataURL('image/png'));
            }
            lienzo.deshacerHistorial.length = 0;
            if (lienzo.clicks === 0) {
                xIni = event.offsetX;
                yIni = event.offsetY;
                $canvas.drawArc({
                    fillStyle: lienzo.strokeColor,
                    x: xIni,
                    y: yIni,
                    radius: (lienzo.strokeTamanio / 2),
                    start: 0,
                    end: 360
                });
                lienzo.clicks++;
            } else if (lienzo.clicks === 1) {
                xEnd = event.offsetX;
                yEnd = event.offsetY;
                dibujarLinea();
                lienzo.drag = true;
                lienzo.clicks++;
                if (!isMultilinea) {
                    lienzo.clicks = 0;
                }
            } else if (lienzo.clicks >= 1) {
                xIni = xEnd;
                yIni = yEnd;
                xEnd = event.offsetX;
                yEnd = event.offsetY;
                lienzo.drag = true;
                dibujarLinea();
            }
            return false;
        });

        // PARAMOS DE DIBUJAR CUANDO SE SUELTA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mouseup'), function() {
            if (lienzo.clicks === 0) {
                lienzo.drag = false;
            } else if (lienzo.clicks >= 1) {
                lienzo.drag = false;
            }
        });

        // MIENTRAS MOVEMOS EL RATÓN REFRESCAMOS
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mousemove'), function(event) {
            if (lienzo.drag === true) {
                lienzo.borrarCanvas()
                $canvas.drawImage({
                    source: lienzo.ultimo.src,
                    x: 0,
                    y: 0,
                    fromCenter: false,
                    load: function() {
                        xDrag = event.offsetX;
                        yDrag = event.offsetY;
                        xControl = xEnd - (xDrag - xEnd);
                        yControl = yEnd - (yDrag - yEnd);
                        $canvas.drawQuadratic({
                            strokeWidth: lienzo.strokeTamanio,
                            strokeStyle: lienzo.strokeColor,
                            strokeCap: 'round',
                            x1: xIni,
                            y1: yIni,
                            cx1: xControl,
                            cy1: yControl,
                            x2: xEnd,
                            y2: yEnd
                        });
                    }
                });
            }
        });

    };
})(jQuery);
