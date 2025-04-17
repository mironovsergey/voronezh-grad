export type MenuItem = {
  rel: string;
  id: number;
  'is-active': number;
  'is-deleted': number;
  status: string;
  link: string;
  name: string;
  text: string;
};

export type MenuData = {
  item?: Record<string, MenuItem>;
  module: string;
  method: string;
};
