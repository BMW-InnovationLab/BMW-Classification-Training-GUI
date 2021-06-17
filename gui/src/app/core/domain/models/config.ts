import {IBasicConfig} from './basic-config';

export interface IConfig extends IBasicConfig{
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

export class AdvancedConfig implements IConfig {
  MSRAPrelu: boolean = false;
  Xavier: boolean = false;
  // tslint:disable-next-line:variable-name
  batch_size: number = 0;
  data_augmenting: boolean = false;
  epochs: number = 0;
  gpus_count: number[] = [];
  jitter_param: number = 0;
  lighting_param: number = 0;
  lr: number;
  lr_factor: number;
  model_name: string;
  momentum: number;
  new_model: string;
  num_workers: number;
  processor: string;
  wd: number;
  weights_name: string;
  weights_type: string;

  constructor() {
    this.MSRAPrelu = null;
    this.Xavier = null;
    this.batch_size = 0;
    this.data_augmenting = null;
    this.epochs = 0;
    this.gpus_count = [];
    this.jitter_param = 0;
    this.lighting_param = 0;
    this.lr = 0;
    this.lr_factor = 0;
    this.model_name = '';
    this.momentum = 0;
    this.new_model = '';
    this.num_workers = 0;
    this.processor = 'CPU';
    this.wd = 0;
    this.weights_name = '';
    this.weights_type = '';
  }
}
