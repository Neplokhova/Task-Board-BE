export type CardResponse = {
  id: string;
  name: string;
  description: string;
  status: string;
  position: number;
};

export type CardsByStatus = {
  todo: CardResponse[];
  'in-progress': CardResponse[];
  done: CardResponse[];
};
