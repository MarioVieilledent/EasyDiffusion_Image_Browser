<script lang="ts">
    import type { Image } from "./types";

    export let image: Image;

    const buildImgUrl = (id: string) => window.location.hostname === 'localhost' ? `http://localhost:3000/${id}` : `http://${window.location.hostname}:3000/${id}`;
</script>

<div class="row-info">
    <span class="prompt">{image.description.prompt}</span>
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
</div>
<img class="image" src={buildImgUrl(image.imgPath)} alt={image.id} />

<style lang="scss">
    .row-info {
        margin: 6px 0px 3px 0px;
        padding: 0px 6px;
        display: flex;
        flex-direction: column;

        .prompt {
            color: #ddd;
            font-size: 14px;
            margin-bottom: 6px;
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
