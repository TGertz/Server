import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = './uploads';

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.use(express.static('uploads'));

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('Нет файла');
  res.json({ message: 'Файл загружен', filename: req.file.filename });
});

app.get('/download/:filename', (req, res) => {
  const filepath = path.join(UPLOAD_DIR, req.params.filename);
  if (!fs.existsSync(filepath)) return res.status(404).send('Файл не найден');
  res.download(filepath);
});

app.get('/list', (_, res) => {
  const files = fs.readdirSync(UPLOAD_DIR);
  res.json(files);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
