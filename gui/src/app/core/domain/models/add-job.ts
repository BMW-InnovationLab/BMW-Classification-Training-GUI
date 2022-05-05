export interface IAddJob {
  name: string;
  api_port: number;
  gpus_count: number[];
}

export class AddJob implements IAddJob {
  name: string;
  api_port: number;
  gpus_count: number[];

  constructor();
  constructor(name?: string, api_port?: number, gpus_count?: number[]) {
    this.name = name || '';
    this.api_port = api_port || 0;
    this.gpus_count = gpus_count || [];
  }
}
