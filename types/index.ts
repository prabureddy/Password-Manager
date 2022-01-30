import { Manager } from "@prisma/client";

export type GeneratePageProps = {
  managers: Partial<Manager>[];
  favIconURL: string;
};

export type IManagerItemPageProps = {
  id: string;
  site: string;
  user: string;
  favicon: string;
  selected: boolean;
  onClick: (id: string) => void;
};
