<script lang="ts">
  import { onMount } from "svelte";
  import type { Image } from "./types";
  import ImageComponent from "./ImageComponent.svelte";

  const SAVED_QUERY = "savedQuery";

  let loading = true;

  const buildUrl = (prompt: string) =>
    `http://localhost:3000/ai?q=${encodeURI(prompt)}`;

  let images: Image[] = [];

  let input = "";

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
      load({ key: "Enter" });
    }
  });
</script>

<div class="container">
  <div class="header">
    <input type="text" bind:value={input} on:keyup={(event) => load(event)} />
  </div>
  <div class="images">
    {#if !loading}
      {#each images as image}
        <ImageComponent {image} />
      {/each}
    {/if}
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

      input {
        background-color: #343a40;
        border-radius: 6px;
        height: 30px;
        border: none;
        padding: 3px 6px;
        width: 350px;
      }
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
  }
</style>
