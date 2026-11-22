export interface Ticket {
  id: number;
  event_id: number;
  type: string;
  status: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};
