/**
 * Adaptive Card data model. Properties can be referenced in an adaptive card via the `${var}`
 * Adaptive Card syntax.
 */
export interface QueryData {
  agentId: string
  agentName: string;
  comment: string;
  description: string;
  product: string;
  title: string;
  type: string;
}
