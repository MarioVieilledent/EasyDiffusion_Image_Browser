<script lang="ts">
  import { onMount } from "svelte";
  import type { Image } from "./types";
  import ImageComponent from "./ImageComponent.svelte";

  const SAVED_QUERY = "savedQuery";

  let fetchState: "ok" | "loading" | "error" | "notStarted" = "notStarted";

  let images: Image[] = [];
  let models: string[] = [];

  let input = "";

  let modelFilter: string[] = [];
  let starredFilter: boolean = false;

  let debounceTimeout: any;

  const buildUrl = (prompt: string) =>
    window.location.hostname === "localhost"
      ? `http://localhost:3000/ai?q=${encodeURI(prompt)}`
      : `http://${window.location.hostname}:3000/ai?q=${encodeURI(prompt)}`;

  const debounce = (func: any, delay: number) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      func();
    }, delay);
  };

  const handleInputChange = (event: any) => {
    const query = event.target.value;
    if (query === "") {
      fetchState = "notStarted";
    } else {
      fetchState = "loading";
      load(query);
    }
  };

  function load(query: string): void {
    fetchState = "loading";

    window.localStorage.setItem(SAVED_QUERY, query);

    debounce(() => {
      fetch(buildUrl(query)).then((res) =>
        res
          .json()
          .then((data: Image[]) => {
            // Store all images
            images = data;
            // Retrieve all models
            models = data.reduce((acc: string[], image: Image) => {
              if (image.description?.use_stable_diffusion_model) {
                const model = image.description.use_stable_diffusion_model;
                return acc.includes(model) ? acc : [...acc, model];
              } else {
                return acc;
              }
            }, []);
            modelFilter = models;
            fetchState = "ok";
          })
          .catch((e) => {
            fetchState = "error";
            console.warn("Can't fetch from server.");
            console.warn(e);
          })
      );
    }, 300);
  }

  onMount(() => {
    const savedQueryLS = window.localStorage.getItem(SAVED_QUERY);
    if (savedQueryLS) {
      input = savedQueryLS;
      load(savedQueryLS);
    }
  });
</script>

<div class="container">
  <div class="header">
    <input type="text" bind:value={input} on:keyup={handleInputChange} />
    <span
      >{`${images.filter((image) => ((starredFilter && image.starred) || !starredFilter) && image.description?.use_stable_diffusion_model && modelFilter.includes(image.description.use_stable_diffusion_model)).length}/${images.length}`}</span
    >
  </div>
  <div class="content">
    <div class="left-panel">
      <span>Filter models</span>
      {#each models as model}
        {@const nbOfImageOfThisModel = images.filter(
          (image) =>
            image.description?.use_stable_diffusion_model &&
            model === image.description.use_stable_diffusion_model
        ).length}
        <button
          on:click={() => {
            if (modelFilter.includes(model)) {
              modelFilter = modelFilter.filter((m) => m !== model);
            } else {
              modelFilter = [...modelFilter, model];
            }
          }}
          class={modelFilter.includes(model) ? "selected" : "unselected"}
        >
          <span>{`${model} (${nbOfImageOfThisModel})`}</span>
        </button>
      {/each}

      <button
        on:click={() => (modelFilter = models)}
        class={modelFilter.length === models.length ? "selected" : "unselected"}
        >All</button
      >
      <button
        on:click={() => (modelFilter = [])}
        class={modelFilter.length === 0 ? "selected" : "unselected"}
        >None</button
      >

      {#if starredFilter}
        <button on:click={() => (starredFilter = false)}
          >Starred and unstarred</button
        >
      {:else}
        <button on:click={() => (starredFilter = true)}>Only Starred</button>
      {/if}
    </div>
    <div class="images">
      {#if fetchState === "ok"}
        {#if images.length === 0}
          <p>No image matching the query filter.</p>
        {/if}
        {#each images as image}
          {#if ((starredFilter && image.starred) || !starredFilter) && modelFilter.includes(image.description?.use_stable_diffusion_model)}
            <ImageComponent {image} />
          {/if}
        {/each}
      {/if}

      {#if fetchState === "loading"}
        <p>Loading...</p>
      {/if}

      {#if fetchState === "notStarted"}
        <p>Please enter a prompt</p>
      {/if}

      {#if fetchState === "error"}
        <p>Something went wrong, open console for more details.</p>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .header {
      width: 100%;
      height: 50px;
      background-color: #101010;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;

      input {
        background-color: #343a40;
        border-radius: 6px;
        height: 30px;
        border: none;
        padding: 3px 6px;
        width: 350px;
      }
    }

    .content {
      display: flex;
      width: 100%;
      height: calc(100% - 50px);

      .left-panel {
        width: 200px;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        gap: 12px;
        padding: 12px;
        background-color: #222222;

        button {
          word-wrap: break-word;
        }
      }

      .images {
        width: calc(100% - 200px);
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 12px;
        gap: 12px;
        overflow-y: auto;
        background-color: #333333;
      }
    }
  }
</style>
