export interface IBasicConfig {
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

export class BasicConfig implements IBasicConfig {
  lr: number;
  batch_size: number;
  epochs: number;
  gpus_count: number[];
  processor: string;
  weights_type: string;
  weights_name: string;
  model_name: string;
  new_model: string;

  constructor();
  constructor(basicConfig?: IBasicConfig) {
    this.lr = basicConfig && basicConfig.lr || 0;
    this.batch_size = basicConfig && basicConfig.batch_size || 0;
    this.epochs = basicConfig && basicConfig.epochs || 0;
    this.gpus_count = basicConfig && basicConfig.gpus_count || [];
    this.processor = basicConfig && basicConfig.processor || '';
    this.weights_type = basicConfig &&  basicConfig.weights_type || '';
    this.weights_name = basicConfig && basicConfig.weights_name || '';
    this.model_name = basicConfig && basicConfig.model_name || '';
    this.new_model = basicConfig && basicConfig.new_model || '';
  }
}
