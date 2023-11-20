/**
 * Adaptive Card data model. Properties can be referenced in an adaptive card via the `${var}`
 * Adaptive Card syntax.
 */
export interface QueryData {
  product:string;
  title: string;
  description: string;
  type: string;
}
