import { Award } from "../models/publications/Award";
import { Article } from "../models/publications/Article";
import { Book } from "../models/publications/Book";
import { Conference } from "../models/publications/Conference";
import { Contract } from "../models/publications/Contract";
import { Project } from "../models/publications/Project";
import { Thesis } from "../models/publications/Thesis";
import { IUser } from "../models/User";
import { Sexenio } from "../models/publications/Sexenio";

export enum MeritTypes {
    Book = "Book",
    Article = "Article",
    Award = "Award",
    Conference = "Conference",
    Contract = "Contract",
    Project = "Project",
    Sexenio = "Sexenio",
    Thesis = "Thesis"
}

export type MeritData = {
    type: MeritTypes;
    title: string;
    user: IUser;
    score: number;
    complete: boolean;
    [key: string]: any; // Additional properties specific to each merit type
}

export const meritCreator = async (data: MeritData): Promise<boolean> => {
    const type = data.type;
    if (!type) {
        throw new Error("Merit type is required");
    }

    switch(type) {
        case MeritTypes.Sexenio:
            const sexenio = new Sexenio(data);
            sexenio.save();
            return true;

        case MeritTypes.Award:
            const award = await Award.create({
                user: data.user,
                title: data.title,
                awardType: data.type, // tipo de premio
                complete: data.complete,
                score: data.score
            });
            award.save();
            return true;
            
        case MeritTypes.Article:
            const article = new Article(data);
            article.save();
            return true;
        
        case MeritTypes.Book:
            const book = new Book(data);
            book.save();
            return true;
        
        case MeritTypes.Conference:
            const conference = new Conference(data);
            conference.save();
            return true;
        
        case MeritTypes.Contract:
            const contract = new Contract(data);
            contract.save();
            return true;
        
        case MeritTypes.Project:
            const project = new Project(data);
            project.save();
            return true;
        
        case MeritTypes.Thesis:
            const thesis = new Thesis(data);
            thesis.save();
            return true;
        
        default:
            throw new Error(`Invalid merit type: ${type}`);
    }
}