(function($) {
    $.fn.herramientaFlecha = function(lienzo) {

        // VARIABLES
        var $canvas = this;
        $canvas.unbind();
        lienzo.clicks = 0;
        var xIni, yIni, xEnd, yEnd, xControl, yControl, xDrag, yDrag;

        // DIBUJAMOS LA FLECHA
        var dibujarLinea = function() {
            $canvas.drawLine({
                strokeStyle: lienzo.strokeColor,
                strokeWidth: lienzo.strokeTamanio,
                strokeCap: 'round',
                strokeJoin: 'round',
                endArrow: true,
                arrowRadius: 90,
                arrowAngle: 90,
                x1: xIni,
                y1: yIni,
                x2: xEnd,
                y2: yEnd,
            });
        };

        // EMPEZAMOS A DIBUJAR CUANDO SE PRESIONA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mousedown'), function(event) {
            if (lienzo.clicks === 0) {
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
                lienzo.clicks = 0;
            }
            return false;
        });

        // PARAMOS DE DIBUJAR CUANDO SE SUELTA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mouseup'), function() {
            if (lienzo.clicks === 0) {
                lienzo.drag = false;
            }
            if (lienzo.clicks >= 1) {
                lienzo.drag = false;
                lienzo.ultimo.src = $canvas[0].toDataURL('image/png');
            }
        });

    };
})(jQuery);
