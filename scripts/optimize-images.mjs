// Convierte las imágenes fuente a WebP optimizado. Uso: node scripts/optimize-images.mjs <carpetaImagenes> <carpetaBrochure>
import sharp from 'sharp';
import path from 'node:path';
const [imgDir, broDir] = process.argv.slice(2);
const out = 'public/img';
const jobs = [
  [imgDir, 'Propuestas (2).jpg', 'fachada-1', 1600],
  [imgDir, 'Propuestas (1).jpg', 'fachada-2', 1600],
  [imgDir, 'Couple_walking_towards_apartments_a81709b6.jpg', 'pareja-acceso', 1600],
  [imgDir, 'Couple_sitting_on_couch_7fac0f14.jpg', 'pareja-sala', 1200],
  [imgDir, 'Living_room_of_apartment_develop#U2026_20261009173105.jpg', 'sala-comedor', 1200],
  [imgDir, 'Mediterraneo.jpg', 'sala-mediterraneo', 1200],
  [imgDir, 'Renovated_apartment_kitchen_stove_87a25abf.jpg', 'cocina', 1200],
  [imgDir, 'Man_opening_apartment_door_9120d8c5.jpg', 'llaves', 1200],
  [imgDir, 'Student_walking_on_sidewalk_2K_20261027162616.jpg', 'estudiante', 1400],
  [imgDir, 'estudiante01.png', 'estudiante-recorte', 1100, true],
  [imgDir, 'Fachada02_Sinfondo.png', 'fachada-recorte', 1200, true],
  [imgDir, 'DepaInt3dFlow.png', 'depa-3d', 2000],
  [imgDir, 'Apartment_architectural_plan_vec#U2026_76387f80.jpg', 'plano-depa', 1200],
  [imgDir, 'Architectural_plan_of_apartment_#U2026_543532e9.jpg', 'plano-conjunto', 1600],
  [imgDir, 'Mapa01-13.png', 'mapa', 2048],
  [imgDir, 'Apartments_emerging_from_city_map_c700a5b1.jpg', 'maqueta-mapa', 1200],
  [imgDir, 'Apartment_model_on_map_pin_6a538177.jpg', 'vialidades', 1600],
];
for (const [dir, file, name, w, alpha] of jobs) {
  const src = path.join(dir, file);
  await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: alpha ? 82 : 78, alphaQuality: 90 }).toFile(path.join(out, name + '.webp'));
  console.log('ok', name);
}
// Imagen para compartir en redes (Open Graph)
await sharp(path.join(imgDir, 'Propuestas (2).jpg')).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toFile(path.join(out, 'og.jpg'));
