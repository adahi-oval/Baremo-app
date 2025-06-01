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

        switch(type) {
            case MeritTypes.Sexenio:
                const sexenio = new Sexenio(data);
                sexenio.save();
                return sexenio.complete ? true : false;

            case MeritTypes.Award:
                const user = await User.findByUsernameAll(data.username);
                const award = await Award.create({
                    user: user,
                    title: data.title,
                    awardType: data.awardType, // tipo de premio
                    score: scoreCalculator(data)
                });

                return award.complete ? true : false;
                
            case MeritTypes.Article:
                const article = new Article(data);
                article.save();
                return article.complete ? true : false;
            
            case MeritTypes.Book:
                const book = new Book(data);
                book.save();
                return book.complete ? true : false;
            
            case MeritTypes.Conference:
                const conference = new Conference(data);
                conference.save();
                return conference.complete ? true : false;
            
            case MeritTypes.Contract:
                const contract = new Contract(data);
                contract.save();
                return contract.complete ? true : false;
            
            case MeritTypes.Project:
                const project = new Project(data);
                project.save();
                return project.complete ? true : false;
            
            case MeritTypes.Thesis:
                const thesis = new Thesis(data);
                thesis.save();
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