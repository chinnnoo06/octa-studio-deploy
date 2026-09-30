import { HydratedDocument } from "mongoose";

export type TProjectSEO = {
    metaTitle: string,
    metaDescription: string
}

export type TProject = {
    slug: string,
    name: string,
    description: string,
    sector: string,
    images: string[],
    videos: string[],
    seo: TProjectSEO
};


export type TProjectDocument = HydratedDocument<TProject>
