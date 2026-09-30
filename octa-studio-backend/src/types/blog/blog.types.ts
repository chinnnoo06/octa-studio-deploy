import { HydratedDocument } from "mongoose";

export enum BlogCategory {
    STAND_DESIGN = 'Diseño de Stands',
    ASSEMBLY_AND_LOGISTICS = 'Montaje y Logística',
    MATERIALS_AND_SUSTAINABILITY = 'Materiales y Sustentabilidad',
    SUCCESS_CASES = 'Casos de Éxito / Proyectos',
    EXHIBITOR_GUIDES = 'Guías para Expositores',
    FAIRS_AND_EVENTS = 'Ferias y Eventos',
    EXHIBITION_TRENDS = 'Tendencias en Exhibición Comercial',
    OCTA_NEWS = 'Noticias Octa'
}

export type TBlogSEO = {
    metaTitle: string,
    metaDescription: string
}

export type TBlog = {
    slug: string,
    title: string,
    excerpt: string,
    category: BlogCategory,
    readingTime: number,
    image: string,
    content: string,
    seo: TBlogSEO
}


export type TBlogDocument = HydratedDocument<TBlog>
