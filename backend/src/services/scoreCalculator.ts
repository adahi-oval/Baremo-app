import { Award } from "../models/publications/Award";
import { Article } from "../models/publications/Article";
import { Book } from "../models/publications/Book";
import { Conference } from "../models/publications/Conference";
import { Contract } from "../models/publications/Contract";
import { Project } from "../models/publications/Project";
import { Thesis } from "../models/publications/Thesis";
import { Sexenio } from "../models/publications/Sexenio";
import { MeritData, MeritTypes } from "./meritCreator";

export const scoreCalculator = (data: MeritData): number => {
    const meritType = data.type as MeritTypes;

    switch (meritType) {
        case MeritTypes.Sexenio:
            if (data.active == null || data.active == undefined) { throw new Error("Active flag missing") }

                if (data.active == true) {
                    return 7;
                }
                else {
                    return 0;
                }

        case MeritTypes.Award:
            let awardScore = 0;
            if(!data.awardType) { throw new Error("Award Type missing") }

            if (data.awardType === "international") {
                awardScore = 2;
            }
            else if (data.awardType === "national") {
                awardScore = 1;
            } 
            else if (data.awardType === "autonomic") {
                awardScore = 0.5;
            } 
            else if (data.awardType === "other") {
                awardScore = 0.2
            }

            return awardScore;
        
        case MeritTypes.Article:
            const articlePosition = data.position as string;
            if(!data.index || !articlePosition) { throw new Error("Index and Position are required") }

            if (data.index != "No Indexado") {
                switch(articlePosition.toLowerCase()) {
                    case "hcp":
                        return 7;
                    
                    case "d1":
                        return 5;
                    
                    case "q1":
                        return 4;

                    case "q2":
                        return 3;
                    
                    case "q3":
                        return 2;
                    
                    case "q4":
                        return 1;

                    default:
                        return 0.5;
                }
            }

        case MeritTypes.Book:
            const bookPosition = data.publisherPosition as string;
            if(!bookPosition) { throw new Error("Position is required") }

            const bookType = data.bookType as string;
            if(!bookType) { throw new Error("Book Type is required") }

            let isBook: boolean;
            if (bookType == "Libro") {
                isBook = true;
            } else if (bookType == "Capitulo") {
                isBook = false;
            } else {
                throw new Error("Invalid Book Type")
            }
        
            switch(bookPosition.toLowerCase()) {
                case "d1":
                    return isBook ? 5 : 3;
                
                case "t1":
                    return isBook ? 3 : 1;

                case "t2":
                    return isBook ? 2 : 0.5;

                case "t3":
                    return isBook ? 1 : 0.2;

                default:
                    return isBook ? 0.5 : 0.25;
                
            }

        case MeritTypes.Conference:
            const conferenceType = data.conferenceType as string;
            if(!conferenceType) { throw new Error("Conference Type is required") }

            const contributionType = data.contributionType as string;
            if(!contributionType) { throw new Error("Contribution Type is required") }

            let isNational: boolean;
            if (conferenceType == "international") {
                isNational = false;
            } else if (conferenceType == "national") {
                isNational = true;
            } else {
                throw new Error("Invalid Book Type")
            }

            switch(contributionType.toLowerCase()) {
                case "oral":
                    return isNational ? 0.25 : 0.5;

                case "poster":
                    return isNational ? 0.25 : 0.5;

                case "plenaria":
                    return 2;

                case "invitada":
                    return 1;

                default:
                    return 0;
            }
             
        case MeritTypes.Project:
            const projectType = data.projectType as string;
            if(!projectType) { throw new Error("Project Type is required") }

            const projectRole = data.role as string;
            if(!projectRole) { throw new Error("Project Role is required") }

            let isCoIP: boolean;
            if (projectRole == "(co)ip") {
                isCoIP = true;
            } else if (projectRole == "member") {
                isCoIP = false;
            } else {
                throw new Error("Invalid Project Role")
            }

            switch(projectType.toLowerCase()) {
                case "regional":
                    return isCoIP ? 2 : 1;

                case "national":
                    return isCoIP ? 4 : 3;

                case "erasmus, interregional o similar":
                    return isCoIP ? 5 : 3;

                case "h2020 o heurope":
                    return isCoIP ? 7 : 5;

                default:
                    return 0;
            }
        
        default:
            return 0;

    }
}