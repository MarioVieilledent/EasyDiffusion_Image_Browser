<script lang="ts">
    import { onMount } from "svelte";
    const SAVED_QUERY = 'savedQuery';

  let loading = true;

  const buildUrl = (prompt: string) =>
    `http://localhost:3000/ai?q=${encodeURI(prompt)}`;
  const buildImgUrl = (id: string) => `http://localhost:3000/${id}`;

  let images: Image[] = [];

  let input = '';

  function load(event: any): void {
    if (event.key === "Enter") {
      window.localStorage.setItem(SAVED_QUERY, input);

      fetch(buildUrl(input)).then((res) =>
        res.json().then((data) => {
          images = data;
          loading = false;
        })
      );
    }
  }

  onMount(() => {
    const savedQueryLS = window.localStorage.getItem(SAVED_QUERY);
    if (savedQueryLS) {
      input = savedQueryLS;
      load({key: 'Enter'});
    }
  });

  type Image = {
    id: string;
    imgPath: string;
    description: {
      prompt: string;
      negative_prompt: string;
      seed: number;
      use_stable_diffusion_model: string;
      clip_skip: boolean;
      use_controlnet_model: string;
      use_vae_model: string;
      sampler_name: string;
      width: number;
      height: number;
      num_inference_steps: number;
      guidance_scale: number;
      use_lora_model: boolean;
      use_embeddings_model: boolean;
      tiling: boolean;
      use_face_correction: boolean;
      use_upscale: boolean;
    };
  };
</script>

<div class="container">
  <div class="header">
    <input type="text" bind:value={input} on:keyup={(event) => load(event)} />
  </div>
  <div class="images">
    {#if !loading}
      {#each images as image}
        <div class="row-info">
          <span class="prompt"
            >{image.description.prompt}</span
          >
          <span class="details">
            <span class="details-title">Seed:</span>
            <span class="details-value">{image.description.seed}</span>
            <span class="details-title">Dimensions:</span>
            <span class="details-value">{image.description.width}x{image.description.height}</span>
            <span class="details-title">Sampler:</span>
            <span class="details-value">{image.description.sampler_name}</span>
            <span class="details-title">Inference Steps:</span>
            <span class="details-value">{image.description.num_inference_steps}</span>
            <span class="details-title">Guidance Scale:</span>
            <span class="details-value">{image.description.guidance_scale}</span>
            <span class="details-title">Model:</span>
            <span class="details-value">{image.description.use_stable_diffusion_model}</span>
          </span>
          <span class="negative-prompt"
            >{image.description.negative_prompt}</span
          >
        </div>
        <img class="image" src={buildImgUrl(image.imgPath)} alt={image.id} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .header {
    width: 100%;
    height: 50px;
    background-color: #101010;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input {
    background-color: #343a40;
    border-radius: 6px;
    height: 30px;
    border: none;
    padding: 3px 6px;
    width: 350px;
  }

  .images {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    background-color: #333333;
  }

  .image {
    width: 100%;
    max-width: 1000px;
  }

  .row-info {
    margin: 6px 0px 3px 0px;
    display: flex;
    flex-direction: column;
  }

  .prompt {
    color: #ddd;
    font-size: 14px;
    margin-bottom: 6px;
  }

  .details {
    color: #aaa;
    font-size: 12px;
    margin-bottom: 3px;
  }

.details-title {
  font-weight: 800;
}

.details-value {
  margin-right: 6px;
}

  .negative-prompt {
    color: #888;
    font-size: 12px;
    margin-bottom: 3px;
  }
</style>
