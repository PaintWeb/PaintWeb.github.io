(function($) {
    $.fn.herramientaPincel = function(lienzo) {

        // VARIABLES
        var $canvas = this;
        $canvas.unbind();
        lienzo.clicks = 0;
        var xIni, yIni, xEnd, yEnd;

        var drawLine = function() {
            $canvas.drawLine({
                strokeWidth: lienzo.strokeTamanio,
                strokeStyle: lienzo.strokeColor,
                strokeCap: 'round',
                strokeJoin: 'round',
                x1: xIni,
                y1: yIni,
                x2: xEnd,
                y2: yEnd
            });
        };

        // EMPEZAMOS A DIBUJAR CUANDO SE PRESIONA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mousedown'), function(event) {
            lienzo.historial.push(lienzo.ultimo.src = $canvas[0].toDataURL('image/png'));
            lienzo.deshacerHistorial.length = 0;
            if (lienzo.press === true) {
                lienzo.clicks = 0;
            }
            if (lienzo.clicks === 0) {
                lienzo.drag = true;
                xIni = event.offsetX;
                yIni = event.offsetY;
                xEnd = xIni;
                yEnd = yIni;
                $canvas.drawArc({
                    fillStyle: lienzo.strokeColor,
                    x: xIni,
                    y: yIni,
                    radius: (lienzo.strokeTamanio / 2),
                    start: 0,
                    end: 360
                });
                lienzo.clicks += 1;
            }
            return false;
        });

        // PARAMOS DE DIBUJAR CUANDO SE SUELTA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mouseup'), function() {
            lienzo.drag = false;
            lienzo.ultimo.src = $canvas[0].toDataURL('image/png');
            lienzo.clicks = 0;
        });

        // MIENTRAS MOVEMOS EL RATÓN REFRESCAMOS
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mousemove'), function(event) {
            if (lienzo.drag === true && lienzo.clicks >= 1) {
                xIni = xEnd;
                yIni = yEnd;
                xEnd = event.offsetX;
                yEnd = event.offsetY;
                drawLine();
            }
        });

    };
})(jQuery);
