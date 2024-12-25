<script lang="ts">
  import type { Image, ImageRate } from "./types";

  export let image: Image;

  let detailedView = false;

  const buildImgUrl = (id: string) =>
    window.location.hostname === "localhost"
      ? `http://localhost:3000/${id}`
      : `http://${window.location.hostname}:3000/${id}`;

  const buildRateUrl = () =>
    window.location.hostname === "localhost"
      ? `http://localhost:3000/rate`
      : `http://${window.location.hostname}:3000/rate`;

  const rate = (data: ImageRate) => {
    fetch(buildRateUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ok");
        console.log(data);
      })
      .catch((error) => {
        console.error("Error rating image:");
        console.error(error);
      });
  };
</script>

<div class="image" on:click={() => detailedView = !detailedView }>
  <div class="row-info">
    {#if image.description}
      <div class="prompt-and-copy">
        <span class="prompt">{image.description.prompt}</span>
        <button
          class="copy-prompt-button"
          title="copy prompt"
          on:click={() =>
            navigator.clipboard.writeText(image.description.prompt)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
            ><path
              fill="#aaa"
              d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"
            /></svg
          >
        </button>
      </div>
      {#if detailedView}
        <span class="details">
          <span class="details-title">Seed:</span>
          <span class="details-value">{image.description.seed}</span>
          <span class="details-title">Dimensions:</span>
          <span class="details-value"
            >{image.description.width}x{image.description.height}</span
          >
          <span class="details-title">Sampler:</span>
          <span class="details-value">{image.description.sampler_name}</span>
          <span class="details-title">Inference Steps:</span>
          <span class="details-value"
            >{image.description.num_inference_steps}</span
          >
          <span class="details-title">Guidance Scale:</span>
          <span class="details-value">{image.description.guidance_scale}</span>
          <span class="details-title">Model:</span>
          <span class="details-value"
            >{image.description.use_stable_diffusion_model}</span
          >
        </span>
        <span class="negative-prompt">{image.description.negative_prompt}</span>
      {/if}
      <div>
        {#if image.starred}
          <button
            on:click={() => {
              rate({ id: image.id, rate: 0, starred: false });
            }}>UNSTAR</button
          >
        {:else}
          <button
            on:click={() => {
              rate({ id: image.id, rate: 0, starred: true });
            }}>STAR</button
          >
        {/if}
      </div>
    {:else}
      <span class="prompt">{image.id}</span>
      <span class="negative-prompt">no metadata</span>
    {/if}
  </div>
  <img class="image" src={buildImgUrl(image.imgPath)} alt={image.id} />
</div>

<style lang="scss">
  .image {
    display: flex;
    cursor: pointer;
    flex-direction: column;
    width: 400px;

    .row-info {
      margin: 6px 0px 3px 0px;
      padding: 0px 6px;
      display: flex;
      flex-direction: column;

      .prompt-and-copy {
        display: flex;
        align-items: center;

        .prompt {
          color: #ddd;
          font-size: 14px;
        }

        .copy-prompt-button {
          background-color: transparent;
          margin: 0px 0px 0px 6px;
          padding: 0;
          border: none;
          border-radius: 0px;

          svg {
            height: 18px;
          }
        }

        .copy-prompt-button:focus {
          outline: 0;
        }

        .copy-prompt:hover {
          cursor: pointer;
        }
      }

      .details {
        color: #aaa;
        font-size: 12px;
        margin-bottom: 3px;

        .details-title {
          font-weight: 800;
        }

        .details-value {
          margin-right: 6px;
        }
      }

      .negative-prompt {
        color: #888;
        font-size: 12px;
        margin-bottom: 3px;
      }
    }

    .image {
      width: 100%;
      max-width: 1000px;
    }
  }

</style>
