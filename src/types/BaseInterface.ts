export interface BaseInterface {
  id: number;
  version: number;
  whenCreated: Date;
  createdBy: string;
  modifiedBy: string;
  whenModified: Date;
  deleted: boolean;
}
