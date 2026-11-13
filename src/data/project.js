// Toda la información del desarrollo vive aquí.
// Para otros desarrollos de Tegos basta con duplicar este archivo y ajustar los datos.

export const project = {
  name: 'San Joaquín',
  developer: 'Tegos',
  tagline: 'Departamentos cerca de todo',
  claim: 'Inversión inmobiliaria en Querétaro. Ubicación que suma valor.',
  address: 'Callejón de San Joaquín No. 17, Colonia San Pablo, Querétaro, Qro.',
  addressShort: 'Callejón de San Joaquín 17, Col. San Pablo',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Callej%C3%B3n+de+San+Joaqu%C3%ADn+17,+San+Pablo,+Quer%C3%A9taro',
  // TODO: confirmar teléfono/WhatsApp real (el brochure trae 442 123 4567)
  phoneDisplay: '442 123 4567',
  phoneIntl: '524421234567',
  stats: [
    { value: '8', label: 'Torres' },
    { value: '27', label: 'Departamentos' },
    { value: '97', unit: 'm²', label: 'Por departamento' },
    { value: '2', label: 'Recámaras' },
  ],
  amenities: [
    { title: 'Acceso controlado', text: 'Caseta en el ingreso para la tranquilidad de tu familia.' },
    { title: 'Estacionamiento', text: 'Con cajones para visitas dentro del conjunto.' },
    { title: 'Áreas verdes', text: 'Jardines y andadores arbolados entre las torres.' },
    { title: '8 torres', text: '27 departamentos: una comunidad tranquila y a escala humana.' },
  ],
  unit: {
    area: 97,
    features: ['2 recámaras', 'Sala - comedor', 'Cocina equipada', 'Cuarto de lavado', '2 baños completos'],
  },
  // Coordenadas en % sobre la imagen depa-3d.webp
  unitHotspots: [
    { id: 'cocina', label: 'Cocina equipada', x: 11, y: 31 },
    { id: 'comedor', label: 'Comedor', x: 42, y: 32 },
    { id: 'balcon', label: 'Balcón', x: 42, y: 11 },
    { id: 'sala', label: 'Sala', x: 44, y: 69 },
    { id: 'lavado', label: 'Cuarto de lavado', x: 9, y: 62 },
    { id: 'bano1', label: 'Baño completo', x: 60, y: 24 },
    { id: 'bano2', label: 'Baño completo', x: 60, y: 66 },
    { id: 'rec1', label: 'Recámara principal', x: 80, y: 25 },
    { id: 'rec2', label: 'Recámara 2', x: 81, y: 74 },
  ],
  // Puntos de interés, coordenadas en px sobre mapa.webp (1081 x 1056 original)
  map: { width: 1081, height: 1056, home: { x: 312, y: 438 } },
  pois: [
    { n: 1, name: 'Tec de Monterrey', type: 'Educación', x: 570, y: 461 },
    { n: 2, name: 'UNITEC', type: 'Educación', x: 157, y: 531 },
    { n: 3, name: 'Costco', type: 'Comercio', x: 995, y: 380 },
    { n: 4, name: 'Soriana', type: 'Comercio', x: 592, y: 341 },
    { n: 5, name: 'Walmart', type: 'Comercio', x: 814, y: 354 },
    { n: 6, name: "Sam's Club", type: 'Comercio', x: 721, y: 354 },
    { n: 7, name: 'Oficinas INFONAVIT', type: 'Servicios', x: 228, y: 196 },
    { n: 8, name: 'Clínica Star Médica', type: 'Salud', x: 505, y: 299 },
    { n: 9, name: 'Parque Querétaro 2000', type: 'Recreación', x: 813, y: 270 },
    { n: 10, name: 'Primera Plus', type: 'Transporte', x: 205, y: 708 },
  ],
  roads: ['Blvd. Bernardo Quintana', 'Av. 5 de Febrero', 'Av. Pie de la Cuesta'],
};

export const waLink = (text = 'Hola, me interesa información de San Joaquín.') =>
  `https://wa.me/${project.phoneIntl}?text=${encodeURIComponent(text)}`;
