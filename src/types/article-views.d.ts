export interface ArticleViews {
  [articleId: string]: string;
}

declare module "*.json" {
  const value: Record<string, string>;
  export default value;
}