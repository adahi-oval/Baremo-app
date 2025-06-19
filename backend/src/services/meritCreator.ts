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

export interface CreatorResponse {
    complete: boolean,
    _id: string
}

export const meritCreator = async (data: MeritData): Promise<CreatorResponse | null> => {
    try {
        const type: string = data.pubType;
        if (!type) {
            throw new Error("Merit type is required");
        }

        const user = await User.findByResearcherIdPrivate(data.researcherId);
        if (!user) {
            throw new Error("user not found or not provided.");
        }

        switch (type.toLowerCase()) {
            case MeritTypes.Sexenio: {
                const sexenio = await Sexenio.create({
                    user: user,
                    title: data.title,
                    active: data.active,
                    year: data.year,
                });
                return { complete: sexenio.complete, _id: sexenio._id as string };
            }

            case MeritTypes.Award: {
                const award = await Award.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    awardType: data.awardType,
                });
                return { complete: award.complete, _id: award._id as string };
            }

            case MeritTypes.Article: {
                const article = await Article.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    index: data.index,
                    position: data.position,
                });
                return { complete: article.complete, _id: article._id as string };
            }

            case MeritTypes.Book: {
                const book = await Book.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    bookType: data.bookType,
                    publisher: data.publisher,
                    publisherPosition: data.publisherPosition,
                });
                return { complete: book.complete, _id: book._id as string };
            }

            case MeritTypes.Conference: {
                const conference = await Conference.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    conferenceType: data.conferenceType,
                    contributionType: data.contributionType,
                });
                return { complete: conference.complete, _id: conference._id as string };
            }

            case MeritTypes.Contract: {
                const contract = await Contract.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    role: data.role,
                });
                return { complete: contract.complete, _id: contract._id as string };
            }

            case MeritTypes.Project: {
                const project = await Project.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    projectType: data.projectType,
                    role: data.role,
                });
                return { complete: project.complete, _id: project._id as string };
            }

            case MeritTypes.Thesis: {
                const thesis = await Thesis.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    thesisType: data.thesisType,
                });
                return { complete: thesis.complete, _id: thesis._id as string };
            }

            case MeritTypes.Transference: {
                const transference = await Transference.create({
                    user: user,
                    title: data.title,
                    year: data.year,
                    transferenceType: data.transferenceType,
                });
                return { complete: transference.complete, _id: transference._id as string };
            }

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
};
