const express = require("express");
const cors = require("cors");
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const path = "../"
const MAX_IMAGES_SENT = 1000;

let database = buildImagesAndDescriptions();

app.use(cors());

app.use(express.static(path));

app.get('/ai', (req, res) => {
  const queryParam = req.query.q;
  if (!queryParam) {
    return res.status(400).json({ error: 'Query parameter "param" is required.' });
  }

  const words = queryParam.trim().toLowerCase().split(' ');

  let result = shuffle(database.filter(e =>
    words.every(word => e.description?.prompt?.trim().toLowerCase().includes(word))
  ));

  // Limit the number of images sent to clients
  result = result.slice(0, MAX_IMAGES_SENT);

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Recursive function to get files
function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}


function buildImagesAndDescriptions() {
  let database = [];

  const files = getFiles(path);
  const jsons = files.filter(e => e.endsWith('.json'));
  const jpegs = files.filter(e => e.endsWith('.jpeg'));
  const others = files.filter(e => (!e.endsWith('.jpeg') && !e.endsWith('.json')));

  // Find pairs
  jpegs.forEach(imgPath => {
    const id = imgPath.slice(0, -5);
    const index = jsons.findIndex(e => e.includes(id + '.json'));

    if (index >= 0) {
      const description = JSON.parse(fs.readFileSync(jsons[index]));
      database.push({
        id,
        imgPath,
        description,
      });
    } else {
      database.push({
        id,
        imgPath,
      });
    }
  });

  return database;
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}