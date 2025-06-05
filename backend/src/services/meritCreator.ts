import { Award } from "../models/merits/Award";
import { Article } from "../models/merits/Article";
import { Book } from "../models/merits/Book";
import { Conference } from "../models/merits/Conference";
import { Contract } from "../models/merits/Contract";
import { Project } from "../models/merits/Project";
import { Thesis } from "../models/merits/Thesis";
import { Sexenio } from "../models/merits/Sexenio";
import { Transference } from "../models/merits/Transference";
import { Captacion } from "../models/merits/Captacion";
import { User } from "../models/User";
import { scoreCalculator } from "./scoreCalculator";

export enum MeritTypes {
    Book = "book",
    Article = "article",
    Award = "award",
    Conference = "conference",
    Contract = "contract",
    Project = "project",
    Sexenio = "sexenio",
    Thesis = "thesis",
    Transference = "transference"
}

export type MeritData = {
    type: MeritTypes;
    title: string;
    username: string;
    score: number;
    complete: boolean;
    [key: string]: any; // más keys
}

export const meritCreator = async (data: MeritData): Promise<boolean | null> => {
    try {
        const type = data.type;
        if (!type) {
            throw new Error("Merit type is required");
        }

        const user = await User.findByResearcherIdPrivate(data.user);
        if (!user) {
            throw new Error("ResearcherId not found or not provided.")
        }

        switch(type) {
            case MeritTypes.Sexenio:
                const sexenio = await Sexenio.create({
                    user: user,
                    title: data.title,
                    active: data.active,
                    year: data.year,
                    score: scoreCalculator(data)
                });

                return sexenio.complete ? true : false;

            case MeritTypes.Award:
                const award = await Award.create({
                    user: user,
                    title: data.title,
                    score: scoreCalculator(data),
                    year: data.year,
                    awardType: data.awardType
                });

                return award.complete ? true : false;
                
            case MeritTypes.Article:
                const article = await Article.create({
                    user: user,
                    title: data.title,
                    score: scoreCalculator(data),
                    year: data.year,
                    index: data.index,
                    position: data.position
                });

                return article.complete ? true : false;
            
            case MeritTypes.Book:
                const book = await Book.create({
                    user: user,
                    title: data.title,
                    score: scoreCalculator(data),
                    year: data.year,
                    bookType: data.bookType,
                    publisher: data.publisher,
                    publisherPosition: data.publisherPosition
                });
                
                return book.complete ? true : false;
            
            case MeritTypes.Conference:
                const conference = await Conference.create({
                    user: user,
                    title: data.title,
                    score: scoreCalculator(data),
                    year: data.year,
                    conferenceType: data.conferenceType,
                    contributionType: data.contributionType
                });
                
                return conference.complete ? true : false;
            
            case MeritTypes.Contract:
                const contract = await Contract.create({
                    user: user,
                    title: data.title,
                    score: scoreCalculator(data),
                    year: data.year,
                    role: data.role
                });
                
                return contract.complete ? true : false;
            
            case MeritTypes.Project:
                const project = await Project.create({
                    user: user,
                    title: data.title,
                    score: scoreCalculator(data),
                    year: data.year,
                    projectType: data.projectType,
                    role: data.role
                });
                
                return project.complete ? true : false;
            
            case MeritTypes.Thesis:
                const thesis = await Thesis.create({
                    user: user,
                    title: data.title,
                    score: scoreCalculator(data),
                    year: data.year,
                    thesisType: data.thesisType
                });
                
                return thesis.complete ? true : false;
            
            default:
                throw new Error(`Invalid merit type: ${type}`);
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Unknown error");
        }
    }
}