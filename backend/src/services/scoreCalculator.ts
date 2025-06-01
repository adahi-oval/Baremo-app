import { Award } from "../models/merits/Award";
import { Article } from "../models/merits/Article";
import { Book } from "../models/merits/Book";
import { Conference } from "../models/merits/Conference";
import { Contract } from "../models/merits/Contract";
import { Project } from "../models/merits/Project";
import { Thesis } from "../models/merits/Thesis";
import { Sexenio } from "../models/merits/Sexenio";
import { MeritData, MeritTypes } from "./meritCreator";

export const scoreCalculator = (data: MeritData): number | undefined => {
    const meritType = data.type as MeritTypes;

    switch (meritType) {
        case MeritTypes.Sexenio:
            if (data.active == null || data.active == undefined) { return undefined; }

                if (data.active == true) {
                    return 7;
                }
                else {
                    return 0;
                }

        case MeritTypes.Award:
            let awardScore = 0;
            if(!data.awardType) { return undefined; }

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
            if(!data.index || !articlePosition) { return undefined; }

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
            if(!bookPosition) { return undefined; }

            const bookType = data.bookType as string;
            if(!bookType) { return undefined; }

            let isBook: boolean;
            if (bookType == "Libro") {
                isBook = true;
            } else if (bookType == "Capitulo") {
                isBook = false;
            } else {
                return undefined;
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
            if(!conferenceType) { return undefined; }

            const contributionType = data.contributionType as string;
            if(!contributionType) { return undefined; }

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
            if(!projectType) { return undefined; }

            const projectRole = data.role as string;
            if(!projectRole) { return undefined; }

            let isCoIP: boolean;
            if (projectRole == "(co)ip") {
                isCoIP = true;
            } else if (projectRole == "member") {
                isCoIP = false;
            } else {
                return undefined;
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

        case MeritTypes.Contract:
            const role = data.role as string;
            if(!role) { return undefined; }

            switch(role.toLowerCase()) {
                case "coordinator":
                    return 2;

                case "member":
                    return 1;

                case "n/a":
                    return 0;

                default: 
                    return 0;
            }

        case MeritTypes.Thesis:
            const thesisType = data.thesisType as string;

            switch(thesisType.toLowerCase()) {
                case "industrial codirection":
                    return 1.5;
                
                case "international mention":
                    return 2;

                case "fpu/fpi o similar":
                    return 3;
                
                case "other":
                    return 1;

                case "n/a":
                    return 0;

                default:
                    return 0;
            }

        case MeritTypes.Transference:
            const transferenceType = data.transferenceType as string;

            switch(transferenceType.toLowerCase()) {
                case "patente en explotacion de la ull":
                    return 5;

                case "patente en explotacion con otra entidad vinculada":
                    return 3;

                case "patente no explotada por la ull":
                    return 1;

                case "empresa spin-off ull":
                    return 3;
                
                case "elaboracion de informes":
                    return 1;

                case "propiedad intelectual":
                    return 1;

                case "convenios de colaboracion":
                    return 1;

            }
        
        default:
            return 0;

    }
}