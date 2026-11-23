# Operación Eclipse

Primera versión de un briefing táctico para eventos de airsoft. Es una web
estática, pensada principalmente para abrir desde un QR en dispositivos móviles.

## Ejecutar

```bash
cd /root/airsoft-briefing
python3 -m http.server 8080
```

Después abrí `http://localhost:8080`. Para usarla en una partida, publicá estos
archivos con GitHub Pages, Netlify, Vercel o cualquier hosting estático y
generá el QR con esa URL.

## Accesos por equipo

- `alfa/`: inteligencia clasificada del Equipo Alfa.
- `omega/`: inteligencia clasificada del Equipo Omega.

Cada carpeta tiene su propio `index.html`, por lo que cada QR puede apuntar a
una URL distinta. Los archivos `classified.css` y `classified.js` comparten la
animación y el comportamiento visual entre ambos accesos.

## Personalizar

- Editá la misión, las reglas y la inteligencia directamente en `index.html`.
- Editá los operadores de ejemplo en el arreglo `operators` de `script.js`.
- Los colores y tipografía principales están definidos al comienzo de
  `styles.css`.
- El contador actual comienza en 1 h 42 min al abrir por primera vez. En una
  versión posterior se puede reemplazar por una fecha real de la partida o
  conectar la web a un backend.

La animación de acceso respeta la preferencia del sistema para reducir
movimientos y también se puede omitir manualmente.
