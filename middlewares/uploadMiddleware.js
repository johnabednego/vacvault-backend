const multer = require('multer');

// Set Multer to store files in memory for easy streaming to GridFS
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { upload };
