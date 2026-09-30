import { HydratedDocument, Types } from "mongoose";

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

export type TProjectWithID = TProject & { _id: Types.ObjectId }

export type TProjectDocument = HydratedDocument<TProject>
