const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = req.body.visibility === 'public' ? 'uploads/public' : 'uploads/private';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
    const visibility = req.body.visibility;
    const fileType = req.body['file-type'];
    const filePath = `/uploads/${visibility}/${req.file.filename}`;

    res.json({
        message: 'Fichier importé avec succès !',
        path: filePath,
        type: fileType
    });
});

app.get('/files/public', (req, res) => {
    const publicDir = path.join(__dirname, 'uploads/public');
    if (!fs.existsSync(publicDir)) return res.json([]);

    const files = fs.readdirSync(publicDir).map(file => ({
        name: file,
        path: `/uploads/public/${file}`,
        type: path.extname(file).replace('.', '')
    }));

    res.json(files);
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
