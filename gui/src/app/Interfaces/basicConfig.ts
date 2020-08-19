export interface BasicConfig {
  lr: number;
  batch_size: number;
  epochs: number;
  gpus_count: number[];
  processor: string;
  weights_type: string;
  weights_name: string;
  model_name: string;
  new_model: string;
}
