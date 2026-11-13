# San Joaquín — Sitio web 3D

Sitio del desarrollo **San Joaquín** (Tegos), Callejón de San Joaquín 17, Col. San Pablo, Querétaro.

Hecho con React + Vite + Three.js (React Three Fiber / drei).

## Secciones
- **Hero 3D**: maqueta del conjunto (8 torres, estacionamiento, caseta, acceso con glorieta) con recorrido de cámara al hacer scroll.
- **Masterplan 3D interactivo**: gira la maqueta y selecciona torres.
- **Ubicación 3D**: mapa en perspectiva con arcos hacia los 10 puntos de interés.
- **Departamento 97 m²**: vista 3D con puntos interactivos y plano.
- Galería con perspectiva, perfiles (estudiantes, familias, inversionistas) y contacto por WhatsApp.

## Editar contenido
Todos los textos, teléfono, puntos del mapa y datos del departamento están en `src/data/project.js`.
Para otro desarrollo de Tegos se duplica ese archivo y se ajustan los datos.

## Comandos
```bash
npm install
npm run dev      # desarrollo
npm run zip      # compila y genera san-joaquin-hostinger.zip
```

## Subir a Hostinger
1. hPanel → Archivos → Administrador de archivos → `public_html`.
2. Sube `san-joaquin-hostinger.zip` y elige **Extraer** (el contenido debe quedar directamente en `public_html`, con `index.html` en la raíz).
3. Borra el zip del servidor.

Las imágenes fuente se convirtieron a WebP con `scripts/optimize-images.mjs`.
