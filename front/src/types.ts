export type Image = {
  id: string;
  rate?: number; // Rating system to store in a local JSON
  starred?: boolean; // Rating system to store in a local JSON
  imgPath: string;
  stats: {
    dev: number,
    mode: number,
    nlink: number,
    uid: number,
    gid: number,
    rdev: number,
    blksize: number,
    ino: number,
    size: number,
    blocks: number,
    atimeMs: number,
    mtimeMs: number,
    ctimeMs: number,
    birthtimeMs: number,
    atime: string,
    mtime: string,
    ctime: string,
    birthtime: string,
  }
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

export type ImageRate = {
  id: string;
  rate: number;
  starred: boolean;
};
