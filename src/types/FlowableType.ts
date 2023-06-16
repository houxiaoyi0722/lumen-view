//流程定义
export interface ProcessDefinition {
  id: string;
  category: string;
  name: string;
  key: string;
  description: string;
  version: string;
  resourceName: string;
  deploymentId: string;
  diagramResourceName: string;
  tenantId: string;
  suspensionState: string;
  isGraphicalNotationDefined: boolean;
  derivedFrom: string;
  derivedFromRoot: string;
  derivedVersion: number;
  engineVersion: string;
}
