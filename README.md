# Amada Crochet (Nueva Base)

Migración a una arquitectura moderna orientada a rendimiento y estabilidad responsive.

## Stack

- Next.js (App Router)
- React + TypeScript
- CSS modular por secciones (sin cascada acumulada ni overrides infinitos)

## Rutas

- `/` Home con video + hilo animado estable
- `/catalogo` Catálogo con filtros + carrito + WhatsApp

## Ejecutar

```bash
npm install
npm run dev
```

## Notas técnicas

- La animación del hilo usa `requestAnimationFrame` + `ResizeObserver` con recálculo controlado.
- El alto del SVG evita `scrollHeight` autorreferente para impedir espacios blancos al final.
- Home y catálogo están separados en componentes para escalar cambios sin romper estilos globales.
