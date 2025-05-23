import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avm',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const parser = multer({ storage: storage });

export default parser;