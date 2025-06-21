import { Publication } from "../models/Publication";
import { IUser, User } from "../models/User";
import { IPublication } from "../models/Publication";
import { IArticle } from "../models/merits/Article";
import { IAward } from "../models/merits/Award";
import { IBook } from "../models/merits/Book";
import { IConference } from "../models/merits/Conference";
import { IContract } from "../models/merits/Contract";
import { IProject } from "../models/merits/Project";
import { ISexenio } from "../models/merits/Sexenio";
import { IThesis } from "../models/merits/Thesis";
import { ITransference } from "../models/merits/Transference";

type MeritTypeMap = {
  Article: IArticle[];
  Award: IAward[];
  Book: IBook[];
  Conference: IConference[];
  Contract: IContract[];
  Project: IProject[];
  Sexenio: ISexenio[];
  Thesis: IThesis[];
  Transference: ITransference[];
};

// Se le pasa researcherId y devuelve su puntuación total.
export const userScorer = async (researcherId: number, average: boolean): Promise<number> => {
  const user: IUser | null = await User.findByResearcherIdPrivate(researcherId);
  if(!user) {return -1;}
  
  let merits;
  if (average) {
    merits = await Publication.findAllLast3YearsMeritsByResearcherId(researcherId);
  } else {
    merits = await Publication.findAllActiveMeritsByResearcherId(researcherId);
  }

  if(!merits) {return -1;}

  const splitMerits = splitMeritsByType(merits);  

  const articles: IArticle[] = splitMerits['Article'] || [];
  const awards: IAward[] = splitMerits['Award'] || [];
  const books: IBook[] = splitMerits['Book'] || [];
  const conferences: IConference[] = splitMerits['Conference'] || [];
  const contracts: IContract[] = splitMerits['Contract'] || [];
  const projects: IProject[] = splitMerits['Project'] || [];
  const sexenios: ISexenio[] = splitMerits['Sexenio'] || [];
  const thesis: IThesis[] = splitMerits['Thesis'] || [];
  const transferences: ITransference[] = splitMerits['Transference'] || [];
  
  const bloqueA1 = sexenios.reduce((sum, sexenio) => sum + (sexenio.score || 0), 0);
  const bloqueA2 = Math.min(awards.reduce((sum, award) => sum + (award.score || 0), 0), 5);

  const bloqueB3 = articles.reduce((sum, article) => article.index !== 'no indexado' ? sum + (article.score || 0) : sum + 0, 0);
  const bloqueB4 = Math.min(articles.reduce((sum, article) => article.index === 'no indexado' ? sum + (article.score || 0) : sum + 0,0),10);
  const bloqueB5 = books.reduce((sum, book) => book.publisherPosition !== 'No Indexado' ? sum + (book.score || 0) : sum + 0, 0);
  const bloqueB6 = Math.min(books.reduce((sum, book) => book.publisherPosition === 'No Indexado' ? sum + (book.score) : sum + 0, 0),10);
  const bloqueB7 = Math.min(conferences.reduce((sum, conference) => sum + (conference.score || 0), 0), 10);

  const bloqueC8 = projects.reduce((sum, project) => sum + (project.score || 0), 0);
  const bloqueC9 = Math.min(contracts.reduce((sum, contract) => sum + (contract.score || 0), 0), 10);
  const bloqueC10 = thesis.reduce((sum, thes) => sum + (thes.score || 0), 0);
  const bloqueC11 = transferences.reduce((sum, transference) => sum + (transference.score || 0), 0);

  return bloqueA1 + bloqueA2 + bloqueB3 + bloqueB4 + bloqueB5 + bloqueB6 + bloqueB7 + bloqueC8 + bloqueC9 + bloqueC10 + bloqueC11;
}

// separador de meritos por tipo
function splitMeritsByType(merits: IPublication[]): Partial<MeritTypeMap> {
  return merits.reduce((acc, merit) => {
    const key = merit.pubType as keyof MeritTypeMap;
    if (!acc[key]) {
      acc[key] = [];
    }
    (acc[key] as IPublication[]).push(merit);
    return acc;
  }, {} as Partial<MeritTypeMap>);
}
