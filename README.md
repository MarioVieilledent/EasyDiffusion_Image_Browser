# EasyDiffusion_Image_Browser

Browse and view all images generated and stored by Easy Diffusion

## EasyDiffusion configuration needs

- Need [EasyDiffusion](https://easydiffusion.github.io/) UI to generate Stable Diffusion images locally
- Easy Diffusion > settings
  - Need to activate `Auto-Save Images`
  - Need to set `Metadata format` to `json`

## Use

- Place this repo inside the destination repository of EasyDiffusion (Easy Diffusion > Settings tab > 
`Save Location` path)
- Start server and client either with bat file (windows), either with running `node server.js` server and `cd front && npm run dev` client
- Open client and browse pictures

## Client brower

![preview](preview.png)

## How does it work

The node.js server `server.js` list all images in jpeg format and metada in json format it found and build an internal JSON list of all images. Then it wait for a GET request `/ai` with query params `q=SomeURLEncodedStringRequest`. The string passed in query params is the user search, separated with spaces. The server filter images and provide all images with their metadata including in prompt all words asked by user.