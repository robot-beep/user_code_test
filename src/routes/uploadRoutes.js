const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

//manejo de subida de archivos con multer 
const handleUpload = (req, res, next) => {
  console.log("route: /upload, method: POST"); 
  console.log("req.file:", req.file);
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, function(err) {
    if (err) {
      console.error('Error en la carga:', err);
      return res.status(400).json({ 
        error: err.message || 'Error al cargar el archivo'
      });
    }
    next();
  });
};

router.post('/', handleUpload, (req, res) => {
  try {
    console.log("route: /upload, method: POST");
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }
    
    // Devolver la URL del archivo
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Error en el procesamiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
