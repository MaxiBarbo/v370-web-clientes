# v370 · Web de clientes

Abrí esta carpeta en Visual Studio Code. Con la extensión Live Server instalada, hacé clic derecho sobre index.html y elegí Open with Live Server. La dirección habitual es http://127.0.0.1:5500. Podés usar otro puerto desde la configuración de la extensión.

También podés servirla con Python desde esta carpeta usando python -m http.server 5500 y abrir http://localhost:5500.

La web incluye portada, marcas, servicios, proceso, formulario editable con revisión, simulación de confirmación, seguimiento, español/inglés y tema claro/oscuro. Los datos del formulario se mantienen en memoria al cambiar secciones y se pierden al recargar. No se envían consultas reales ni se consultan órdenes del taller. La siguiente integración requiere el código actual del backend y su URL para implementar el envío y seguimiento con su contrato real.

Los fondos incluidos son recortes distintos de la fotografía de referencia de las Slides. Se pueden reemplazar por fotografías independientes en assets conservando hero.jpg, equipo.jpg, problema.jpg y contacto.jpg. El logotipo es una representación tipográfica compartida en todas las vistas, pendiente de sustituir por el archivo original aprobado. Los iconos de marcas se incluyen como archivos locales si su descarga fue posible. La fuente DM Sans se carga desde Google Fonts con alternativa del sistema.

Verificar en el navegador a 390 × 844 con las herramientas de dispositivo. El fundido de la portada se vincula al desplazamiento, los bloques aparecen con IntersectionObserver y los fondos cambian mediante opacidad. Se respeta prefers-reduced-motion.


para levantar un server py
python -m http.server 5500 --bind 127.0.0.1

Contacto y ubicación
Editar contacto-config.js con el WhatsApp real (solo dígitos, código de país), teléfono visible y dirección completa. Cambiar provisional a false. El mapa se carga al completar la dirección. El número actual es ficticio. Los botones abren WhatsApp con el mensaje para revisión y envío del cliente. El formulario web y rastreo de esta base siguen en modo demostración.

Actualización visual (19/11/2026): el formulario usa verde salvia tecnológico (#79CBB4) únicamente para el borde de la sección abierta, los indicadores completados y la barra de progreso. Las tarjetas cerradas conservan bordes gris azulado. Se incluyen equivalentes de contraste para tema claro. No se modificaron imágenes, cabecera, colores globales ni lógica de envío.
