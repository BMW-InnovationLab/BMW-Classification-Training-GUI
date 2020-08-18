export interface IConfig {
  // eval_steps: number;
  // training_steps: number;
  // num_classes: number;
  lr: number;
  batch_size: number;
  epochs: number;
  gpus_count: number[];
  processor: string;
  weights_type: string;
  weights_name: string;
  model_name: string;
  new_model: string;
  // network_architecture: string;
  // checkpoint_path?: string;
  // width?: number;
  // height?: number;
  // name: string;
}
