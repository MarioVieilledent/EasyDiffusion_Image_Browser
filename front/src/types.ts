export type Image = {
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