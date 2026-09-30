import { BlogCategory, TBlogSEO } from "./blog.types";

export type TGetBlogsQuery = {
    page?: string,
    category?: BlogCategory
}

export type TBlogDto = {
    title: string,
    excerpt: string,
    category: BlogCategory,
    readingTime: number,
    content: string,
    seo: TBlogSEO
}
