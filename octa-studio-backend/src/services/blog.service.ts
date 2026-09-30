import fs from "fs";
import path from "path";

import { blogRepository } from "../repositories/blog.repository";
import { TMulterFiles } from "../types/multer/multer.types";
import { TBlogDto, TGetBlogsParams } from "../types/blog/blog.dtos";
import { TBlogDocument } from "../types/blog/blog.types";
import { deleteAllUploadedFiles } from "../utils/deleteFiles";
import { HttpError } from "../utils/error";
import { buildSlug } from "../utils/slug";
import { CONTENT_IMAGES_PATH, extractContentImages } from "../utils/blogContent";
import { PUBLIC_URL, UPLOADS_PATH } from "../config/env";

const imagesDir = path.resolve(UPLOADS_PATH, "blogs");
const contentImagesDir = path.resolve(UPLOADS_PATH, "blogs", "content");

const BLOGS_PER_PAGE = 6;

const deleteFromDisk = (dir: string, names: string[]) => {
    names.forEach(name => {
        const filePath = path.join(dir, name)

        try {
            fs.unlinkSync(filePath)
            console.log(`Image deleted: ${name}`);
        } catch (err) {
            console.error(`Error deleting ${name}`)
        }
    })
}

const deleteFeaturedImage = (name: string) => deleteFromDisk(imagesDir, [name])
const deleteContentImages = (names: string[]) => deleteFromDisk(contentImagesDir, names)

export const BlogService = {

    async getBlogs({ page, category }: TGetBlogsParams) {
        const filter = category ? { category } : {}

        const result = await blogRepository.findPaginated(page, BLOGS_PER_PAGE, filter)

        return {
            blogs: result.docs,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.totalDocs,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        }
    },

    async createBlog(data: TBlogDto, files?: TMulterFiles) {
        try {
            const slug = buildSlug(data.title)

            const slugTaken = await blogRepository.findBySlug(slug)

            if (slugTaken) {
                throw new HttpError(409, "A blog with that title already exists");
            }

            const image = files?.blogImage?.[0]?.filename

            if (!image) {
                throw new HttpError(400, "A featured image is required for the blog");
            }

            await blogRepository.createBlog({
                ...data,
                slug,
                image
            })

        } catch (error) {
            deleteAllUploadedFiles(files);
            throw error
        }
    },

    async updateBlog(blog: TBlogDocument, data: TBlogDto) {
        const slug = buildSlug(data.title)

        if (slug !== blog.slug) {
            const slugTaken = await blogRepository.findBySlug(slug)

            if (slugTaken) {
                throw new HttpError(409, "A blog with that title already exists");
            }
        }

        // Las imagenes del cuerpo que ya no aparecen en el HTML nuevo se borran
        // del disco despues de guardar, para no dejar huerfanos.
        const before = extractContentImages(blog.content)
        const after = new Set(extractContentImages(data.content))
        const removed = before.filter(name => !after.has(name))

        blog.slug = slug
        blog.title = data.title
        blog.excerpt = data.excerpt
        blog.category = data.category
        blog.readingTime = data.readingTime
        blog.content = data.content
        blog.seo = data.seo

        await blog.save()

        deleteContentImages(removed)
    },

    async updateBlogImage(blog: TBlogDocument, files?: TMulterFiles) {
        try {
            const image = files?.blogImage?.[0]?.filename

            if (!image) {
                throw new HttpError(400, "A featured image is required for the blog");
            }

            const oldImage = blog.image

            blog.image = image
            await blog.save()

            deleteFeaturedImage(oldImage)
        } catch (error) {
            deleteAllUploadedFiles(files);
            throw error
        }
    },

    uploadContentImage(files?: TMulterFiles) {
        const file = files?.blogContentImage?.[0]

        if (!file) {
            throw new HttpError(400, "An image is required");
        }

        const relativePath = `${CONTENT_IMAGES_PATH}/${file.filename}`

        return {
            path: relativePath,
            url: `${PUBLIC_URL}${relativePath}`
        }
    },

    async deleteBlog(blog: TBlogDocument) {
        await blog.deleteOne()

        deleteFeaturedImage(blog.image)
        deleteContentImages(extractContentImages(blog.content))
    }
}
