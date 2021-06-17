export interface IDataset {
  dataset_name: string;
  training_ratio: number;
  validation_ratio: number;
  testing_ratio: number;
}

export class Dataset implements IDataset {
  dataset_name: string;
  training_ratio: number;
  validation_ratio: number;
  testing_ratio: number;

  constructor();
  constructor(dataset?: IDataset) {
    this.dataset_name = dataset && dataset.dataset_name || '';
    this.training_ratio = dataset && dataset.training_ratio || 0;
    this.validation_ratio = dataset && dataset.validation_ratio || 0;
    this.testing_ratio = dataset && dataset.testing_ratio || 0;
  }
}
