const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const path = "../"
const MAX_IMAGES_SENT = 1000;

let database = buildImagesAndDescriptions();

const jsonParser = bodyParser.json();

app.use(cors()); // Allow cors for any webapp

app.use('/webapp', express.static('./front/dist')); // Serve webapp
app.use('/assets/', express.static('./front/dist/assets')); // Redirect webapp requests
app.use('/', express.static(path)); // Serve all files

// POST route to handle rating
app.post('/rate', jsonParser, (req, res) => {
  const { id, rate, starred } = req.body;

  if (typeof id !== 'string' || typeof rate !== 'number' || typeof starred !== 'boolean') {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  // Find the object with the given id
  let item = database.find(img => img.id === id);

  if (item) {
    // Update the rating if item exists
    item.rating = rate;
    item.starred = starred;

    // Save the updated database to the JSON file
    fs.writeFileSync('database.json', JSON.stringify(database, null, 2), 'utf8');

    res.status(200).json({ success: true, data: item });
  } else {
    // Create a new item if it doesn't exist
    const errMessage = `Error, tried to rate an image that doesn't exist in database. Image id = ${id}`;
    console.log(errMessage);
    res.status(404).json({ success: false, error: errMessage });
  }
});

// Query for searching images
app.get('/ai', (req, res) => {
  const queryParam = req.query.q;
  if (!queryParam) {
    return res.status(400).json({ error: 'Query parameter "param" is required.' });
  }

  const words = queryParam.trim().toLowerCase().split(' ');

  // Filtering database to keep only requested images
  // Find patterns in prompt and in filename (id)
  let result = database.filter(e =>
    words.every(word => e.description?.prompt?.trim().toLowerCase().includes(word) ||
      e.id.trim().replaceAll('_', ' ').replaceAll('\\', ' ').replaceAll('/', ' ').toLowerCase().includes(word))
  );

  // Shuffling images
  result = shuffle(result);

  // Limit the number of images sent to clients
  result = result.slice(0, MAX_IMAGES_SENT);

  res.json(result);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}\nWebapp accessible here => http://localhost:${PORT}/webapp/`);
});

/**
 * Find all files, images, txt and json metadata
 * Bind images and their metadata
 */
function buildImagesAndDescriptions() {
  let database = [];

  const files = getFiles(path); // All files
  const jsons = files.filter(e => e.endsWith('.json')); // All json files
  const txts = files.filter(e => e.endsWith('.txt')); // All txt files
  const jpegs = files.filter(e => e.endsWith('.jpeg')); // All image files
  const localDatabase = JSON.parse(fs.readFileSync('database.json')); // Local image list containing ratings and stars

  // Find pairs (iterate over each image and try to find their json, txt or embeded metadata)
  jpegs.forEach(imgPath => {
    const id = imgPath.slice(0, -5);
    const indexJson = jsons.findIndex(e => e.includes(id + '.json'));

    // If image has a json metadata
    if (indexJson >= 0) {
      const description = JSON.parse(fs.readFileSync(jsons[indexJson]));
      database.push({
        id,
        imgPath,
        description,
        starred: localDatabase.find(image => image.id === id)?.starred,
      });
    } else {
      const indexTxt = txts.findIndex(e => e.includes(id + '.txt'));

      // Else if image has txt metadata
      if (indexTxt >= 0) {
        const description = parseTxt(fs.readFileSync(txts[indexTxt]));
        database.push({
          id,
          imgPath,
          description,
          starred: localDatabase.find(image => image.id === id)?.starred,
        });
      } else {

        // Else
        database.push({
          id,
          imgPath,
          starred: localDatabase.find(image => image.id === id)?.starred,
        });
      }
    }
  });

  return database;
}

/**
 * Recursive function to get all files in any depth
 */
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

/**
 * If metadata is stored in txt instead of json, parse txt
 */
function parseTxt(buffer) {
  let desc = {};
  const txt = buffer.toString('utf8');
  console.log(txt);
  const lines = txt.split('\n');
  lines.forEach(line => {
    // Regex to extract elements from txt
    const matches = /^(.*?):\ (.*)/g.exec(line)
    if (matches) {
      let key = matches[1].toLowerCase().replaceAll(' ', '_');
      // Modify certain keywords that doesn't fit json keywords
      key === 'stable_diffusion_model' ? key = 'use_stable_diffusion_model' : {};
      key === 'controlnet_model' ? key = 'use_controlnet_model' : {};
      key === 'vae_model' ? key = 'use_vae_model' : {};
      key === 'sampler' ? key = 'sampler_name' : {};
      key === 'steps' ? key = 'num_inference_steps' : {};
      key === 'sampler' ? key = 'sampler_name' : {};
      key === 'lora_model' ? key = 'use_lora_model' : {};
      key === 'embedding_models:' ? key = 'use_embeddings_model' : {};
      key === 'seamless_tiling' ? key = 'tiling' : {};
      key === 'use_upscaling' ? key = 'use_upscale' : {};
      key === 'upscale_by' ? key = 'upscale_amount' : {};
      const value = matches[2];
      const numValue = Number(value);
      if (value === "None") {
        desc[key] = null;
      } else if (value === "True") {
        desc[key] = true;
      } else if (value === "False") {
        desc[key] = false;
      } else if (isNaN(numValue)) {
        desc[key] = value;
      } else {
        desc[key] = numValue;
      }
    }
  });
  console.log(desc);
  return desc;
}

/**
 * Shuffles an array
 */
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