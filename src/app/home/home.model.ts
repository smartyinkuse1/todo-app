export interface Task {
  id?: string;
  name: string;
  imageUrl: string;
  status: string;
  description: string;
  time: Date;
  createdAt: Date;
}
