(function($) {
    $.fn.herramientaRectangulo = function(lienzo, isCuadrado) {

        // VARIABLES
        var $canvas = this;
        $canvas.unbind();
        var width = 0;
        var height = 0;
        var xStart, yStart, xEnd, yEnd;

        // DIBUJAR RECTANGULO
        function dibujarRectangulo() {
            $canvas.drawRect({
                fillStyle: lienzo.fillColor,
                strokeStyle: lienzo.strokeColor,
                strokeWidth: lienzo.strokeTamanio,
                x: xStart,
                y: yStart,
                width: width,
                height: height,
                fromCenter: true
            });
        }

        // EMPEZAMOS A DIBUJAR CUANDO SE PRESIONA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mousedown'), function(event) {
            lienzo.historial.push(lienzo.ultimo.src = $canvas[0].toDataURL('image/png'));
            xStart = event.offsetX;
            yStart = event.offsetY;
            dibujarRectangulo();
            lienzo.drag = true;
            return false;
        });

        // PARAMOS DE DIBUJAR CUANDO SE SUELTA EL BOTÓN DEL RATÓN
        $canvas.on(lienzo.convierteEventoRatonEnEventoToque('mouseup'), function() {
            lienzo.drag = false;
            width = 0;
            height = 0;
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
                        width = (xEnd - xStart);
                        height = (yEnd - yStart);
                        if (isCuadrado) {
                            height = width;
                        }
                        dibujarRectangulo();
                    }
                });
            }
        });

    };
})(jQuery);
