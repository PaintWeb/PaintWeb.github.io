(function($) {
    $.fn.herramientaElipse = function(lienzo, isCirculo) {

        // VARIABLES
        var $canvas = this;
        $canvas.unbind();
        var xIni, yIni, xEnd, yEnd, width, height;

        // DIBUJAR UNA ELLIPSE
        function dibujarElipse() {
            $canvas.drawEllipse({
                fillStyle: lienzo.fillColor,
                strokeStyle: lienzo.strokeColor,
                strokeWidth: lienzo.strokeTamanio,
                x: xIni,
                y: yIni,
                width: width,
                height: height
            });
        }

        // DIBUJAR UN CÍRCULO
        function dibujarCirculo() {
            $canvas.drawArc({
                fillStyle: lienzo.fillColor,
                strokeStyle: lienzo.strokeColor,
                strokeWidth: lienzo.strokeTamanio,
                x: xIni,
                y: yIni,
                radius: Math.abs(width) / 2,
                fromCenter: true
            });
        }

        // EMPEZAMOS A DIBUJAR CUANDO SE PRESIONA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mousedown'), function(event) {
            lienzo.historial.push(lienzo.ultimo.src = $canvas[0].toDataURL('image/png'));
            lienzo.deshacerHistorial.length = 0;
            lienzo.drag = true;
            width = 0;
            height = 0;
            xIni = event.offsetX;
            yIni = event.offsetY;
            if (!isCirculo) {
              dibujarElipse();
            }
            return false;
        });

        // PARAMOS DE DIBUJAR CUANDO SE SUELTA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mouseup'), function() {
            lienzo.drag = false;
            lienzo.ultimo.src = $canvas[0].toDataURL('image/png');
        });

        // MIENTRAS MOVEMOS EL RATÓN REFRESCAMOS
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mousemove'), function(event) {
            if (lienzo.drag === true) {
                lienzo.borrarCanvas();
                $canvas.drawImage({
                    source: lienzo.ultimo.src,
                    x: 0,
                    y: 0,
                    fromCenter: false,
                    load: function() {
                        xEnd = event.offsetX + (width / 2);
                        yEnd = event.offsetY + (height / 2);
                        width = xEnd - xIni;
                        height = yEnd - yIni;
                        if (isCirculo) {
                            dibujarCirculo();
                        } else {
                            dibujarElipse();
                        }
                    }
                });
            }
        });

    };
})(jQuery);
