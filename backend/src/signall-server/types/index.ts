export type AppMessage = {
  id: number;
  message: string;
  time: string;
  type: 'file' | 'text';
};
