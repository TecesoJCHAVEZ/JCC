# Simulador LDR + Pull‑down (Arduino)

Proyecto listo con **Vite + React + Tailwind + Recharts + Framer Motion**.

## Requisitos
- Node.js 18+
- npm

## Instalación
```bash
npm install
```

## Ejecutar en modo desarrollo
```bash
npm run dev
```
Abre el URL que imprime la consola (por defecto http://localhost:5173).

## Build de producción
```bash
npm run build
npm run preview
```

### Notas
- Los umbrales LOW/HIGH están ajustados a 5 V (ATmega típico): LOW ≤ 1.5 V, HIGH ≥ 3.0 V.
- Ajusta los rangos de sliders según tu LDR.
