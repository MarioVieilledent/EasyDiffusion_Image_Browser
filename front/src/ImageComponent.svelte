<script lang="ts">
    import type { Image } from "./types";

    export let image: Image;

    const buildImgUrl = (id: string) =>
        window.location.hostname === "localhost"
            ? `http://localhost:3000/${id}`
            : `http://${window.location.hostname}:3000/${id}`;
</script>

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
            <span class="details-value">{image.description.guidance_scale}</span
            >
            <span class="details-title">Model:</span>
            <span class="details-value"
                >{image.description.use_stable_diffusion_model}</span
            >
        </span>
        <span class="negative-prompt">{image.description.negative_prompt}</span>
    {:else}
        <span class="prompt">{image.id}</span>
        <span class="negative-prompt">no metadata</span>
    {/if}
</div>
<img class="image" src={buildImgUrl(image.imgPath)} alt={image.id} />

<style lang="scss">
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
                background-color: none !important;
                margin: 0;
                padding: 3px;
                border: none;
                border-radius: 0px;

                svg {
                    height: 18px;
                }
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
</style>
