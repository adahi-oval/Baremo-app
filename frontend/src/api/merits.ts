import api from "./axios";
import type { IUser } from "./user";

export interface IPublication {
  _id: string;
  pubType: string;
  title: string;
  user: IUser;
  year: number;
  score: number;
  complete: boolean;
}

export interface IArticle extends IPublication {
  pubType: "Article";
  index: 'jcr' | 'sjr' | 'no indexado' | 'n/a';
  position: 'hcp' | 'd1' | 'q1' | 'q2' | 'q3' | 'q4' | 'no indexado' | 'n/a';
}

export interface IAward extends IPublication {
  pubType: "Award";
  awardType: 'national' | 'international' | 'autonomic' | 'other' | 'n/a';
}

export interface IBook extends IPublication {
  pubType: "Book";
  bookType: 'Libro' | 'Capítulo de libro' | 'n/a';
  publisher: string;
  publisherPosition: 'D1' | 'T1' | 'T2' | 'T3' | 'No Indexado' | 'n/a';
  isbn?: string;
}

export interface ICaptacion extends IPublication {
  pubType: "Captacion";
  captacionType: "excelencia caixa" | "viera y clavijo senior" | "excelencia fundaciones" | "viera y clavijo junior" | "agustin de betancourt" | "n/a";
}

export interface ICatedra extends IPublication {
  pubType: "Catedra";
  catedraType: "direccion" | "subdireccion" | "n/a";
}

export interface IConference extends IPublication {
  pubType: "Conference";
  conferenceType: 'international' | 'national' | 'n/a';
  contributionType: 'oral' | 'poster' | 'plenaria' | 'invitada' | 'n/a';
}

export interface IContract extends IPublication {
  pubType: "Contract";
  role: 'coordinator' | 'member' | 'n/a';
}

export interface IMagazine extends IPublication {
  pubType: "Magazine";
}

export interface IOrganization extends IPublication {
  pubType: "Organization";
  organizationType: "congresos internacionales" | "congresos nacionales" | "seminarios internacionales" | "otros" | "n/a";
}

export interface IProject extends IPublication {
  pubType: "Project";
  projectType: 'regional' | 'national' | 'erasmus, interregional o similar' | 'H2020 o HEurope' | 'n/a';
  role: '(co)ip' | 'member' | 'n/a';
}

export interface ISexenio extends IPublication {
  pubType: "Sexenio";
  active: boolean;
}

export interface IThesis extends IPublication {
  pubType: "Thesis";
  thesisType: 'industrial codirection' | 'international mention' | 'fpu/fpi o similar' | 'other' | 'n/a';
}

export interface ITransference extends IPublication {
  pubType: "Transference";
  transferenceType:
    | "patente en explotacion de la ull"
    | "patente en explotacion con otra entidad vinculada"
    | "patentes no explotadas por la ull"
    | "empresa spin-off ull"
    | "elaboracion de informes"
    | "propiedad intelectual"
    | "convenios de colaboracion"
    | "n/a";
}

export type Merit = IArticle | IAward | IBook | ICaptacion | ICatedra | IConference | IContract | IMagazine | IOrganization | IProject | ISexenio | IThesis | ITransference;

export async function getAllMerits(): Promise<Merit[]> {
  const res = await api.get("/merits");
  return res.data.merits;
};
