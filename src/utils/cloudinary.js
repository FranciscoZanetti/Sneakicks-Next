const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento de Cloudinary con Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Validación del formato de archivo permitido
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only JPEG and PNG are allowed.');
    }

    const entityType = `${req.body.entityType}s`;  // Tipo de entidad (productos, usuarios, marcas)
    const timestamp = Date.now();
    const folder = `sneakicks/${entityType}`;
    
    // Uso de UUID para garantizar nombres únicos de archivos
    const public_id = `${timestamp}-${uuidv4()}-image-${req.body.entityType}`;
    const format = file.mimetype === 'image/jpeg' ? 'jpg' : 'png';

    // Opcional: Transformaciones para optimizar imágenes
    return {
      folder,
      format,
      public_id,
      transformation: [{ width: 500, height: 500, crop: 'limit' }, { quality: 'auto' }]
    };
  }
});

// Configuración de Multer con el almacenamiento definido
const upload = multer({ storage });

// Función para extraer el `public_id` de la URL de Cloudinary
const getPublicIdFromUrl = (url) => {
    const regex = /\/v\d+\/([^\/]+)\.\w+$/;  // Extrae el public_id basado en el patrón de URL estándar de Cloudinary
    const match = url.match(regex);
    return match ? match[1] : null;
};

module.exports = {
    upload,
    getPublicIdFromUrl
};
