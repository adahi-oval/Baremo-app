import api from "./axios";
import type { IUser } from "./user";

export interface IPublication {
  _id?: string;
  pubType: string;
  title: string;
  user?: IUser;
  researcherId?: number;
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

export type PubType =
  | 'Article'
  | 'Book'
  | 'Award'
  | 'Captacion'
  | 'Catedra'
  | 'Conference'
  | 'Contract'
  | 'Magazine'
  | 'Organization'
  | 'Project'
  | 'Sexenio'
  | 'Thesis'
  | 'Transference';

export const pubTypes: PubType[] = [
  'Article',
  'Book',
  'Award',
  'Captacion',
  'Catedra',
  'Conference',
  'Contract',
  'Magazine',
  'Organization',
  'Project',
  'Sexenio',
  'Thesis',
  'Transference',
];

export type Merit = IArticle | IAward | IBook | ICaptacion | ICatedra | IConference | IContract | IMagazine | IOrganization | IProject | ISexenio | IThesis | ITransference;

export type MeritFields = keyof (IArticle & IAward & IBook & ICaptacion & ICatedra & IConference & IContract & IMagazine & IOrganization & IProject & ISexenio & IThesis & ITransference);

export const emptyMeritByType = (pubType: PubType): Merit => {
  const base = {
    title: '',
    year: new Date().getFullYear(),
    score: 0,
    complete: false
  };

  switch (pubType) {
    case 'Article':
      return {
        ...base,
        pubType: 'Article',
        index: 'n/a',
        position: 'n/a',
      };

    case 'Book':
      return {
        ...base,
        pubType: 'Book',
        bookType: 'n/a',
        publisher: '',
        publisherPosition: 'n/a',
        isbn: '',
      };

    case 'Award':
      return {
        ...base,
        pubType: 'Award',
        awardType: 'n/a',
      };

    case 'Captacion':
      return {
        ...base,
        pubType: 'Captacion',
        captacionType: 'n/a',
      };

    case 'Catedra':
      return {
        ...base,
        pubType: 'Catedra',
        catedraType: 'n/a',
      };

    case 'Conference':
      return {
        ...base,
        pubType: 'Conference',
        conferenceType: 'n/a',
        contributionType: 'n/a',
      };

    case 'Contract':
      return {
        ...base,
        pubType: 'Contract',
        role: 'n/a',
      };

    case 'Magazine':
      return {
        ...base,
        pubType: 'Magazine',
      };

    case 'Organization':
      return {
        ...base,
        pubType: 'Organization',
        organizationType: 'n/a',
      };

    case 'Project':
      return {
        ...base,
        pubType: 'Project',
        projectType: 'n/a',
        role: 'n/a',
      };

    case 'Sexenio':
      return {
        ...base,
        pubType: 'Sexenio',
        active: false,
      };

    case 'Thesis':
      return {
        ...base,
        pubType: 'Thesis',
        thesisType: 'n/a',
      };

    case 'Transference':
      return {
        ...base,
        pubType: 'Transference',
        transferenceType: 'n/a',
      };

    default:
      throw new Error(`Unknown pubType: ${pubType}`);
  }
};

/* Funciones de coms con el backend */

export async function getAllMerits(researcherId: number): Promise<Merit[]> {
  const res = await api.get(`/merits/${researcherId}/institutes`);
  return res.data.merits;
};

export async function getUserMerits(researcherId: number): Promise<Merit[]> {
  const res = await api.get(`/merits/${researcherId}`)

  return res.data.merits;
}

export async function deleteMerit(id: string): Promise<string> {
  const res = await api.delete(`/merits/${id}`);

  return res.status === 200 ? res.data.message : res.data.error;
}

export async function createMerit(merit: Merit): Promise<string> {
  const res = await api.post('/merits', { merit: merit });

  return res.status === 201 ? res.data.id : `Error: ${res.data.error}`;
}

export async function getInstituteScore(selectedInstitute: string): Promise<string> {
  const res = await api.get(`/institute/score/${selectedInstitute}`);

  return res.status === 200 ? res.data.instituteScore : `Error: ${res.data.error}`;
}