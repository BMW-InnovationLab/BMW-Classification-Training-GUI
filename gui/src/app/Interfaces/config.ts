export interface IConfig {
  lr: number;
  batch_size: number;
  epochs: number;
  gpus_count: number[];
  processor: string;
  weights_type: string;
  weights_name: string;
  model_name: string;
  new_model: string;
  momentum: number;
  wd: number;
  lr_factor: number;
  num_workers: number;
  jitter_param: number;
  lighting_param: number;
  Xavier: boolean;
  MSRAPrelu: boolean;
  data_augmenting: boolean;
}
