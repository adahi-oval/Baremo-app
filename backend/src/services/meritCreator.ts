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
import { MeritTypes } from "../types/MeritTypes";
import { MeritData } from "../types/MeritData";

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
                });

                return sexenio.complete;

            case MeritTypes.Award:
                const award = await Award.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    awardType: data.awardType
                });

                return award.complete;
                
            case MeritTypes.Article:
                const article = await Article.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    index: data.index,
                    position: data.position
                });

                return article.complete;
            
            case MeritTypes.Book:
                const book = await Book.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    bookType: data.bookType,
                    publisher: data.publisher,
                    publisherPosition: data.publisherPosition
                });
                
                return book.complete;
            
            case MeritTypes.Conference:
                const conference = await Conference.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    conferenceType: data.conferenceType,
                    contributionType: data.contributionType
                });
                
                return conference.complete;
            
            case MeritTypes.Contract:
                const contract = await Contract.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    role: data.role
                });
                
                return contract.complete;
            
            case MeritTypes.Project:
                const project = await Project.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    projectType: data.projectType,
                    role: data.role
                });
                
                return project.complete;
            
            case MeritTypes.Thesis:
                const thesis = await Thesis.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    thesisType: data.thesisType
                });
                
                return thesis.complete;

            case MeritTypes.Transference:
                const transference = await Transference.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    transferenceType: data.transferenceType
                });

                return transference.complete;
            
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