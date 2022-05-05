export interface IRemoveJob {
  name: string;
}

export class RemoveJob implements IRemoveJob {
  name: string;

  constructor();
  constructor(name?: string) {
    this.name = name || '';
  }
}
