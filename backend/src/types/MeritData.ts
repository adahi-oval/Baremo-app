import { MeritTypes } from "./MeritTypes";

export type MeritData = {
  type: MeritTypes;
  title: string;
  score: number;
  complete: boolean;
  [key: string]: any; // más keys
}