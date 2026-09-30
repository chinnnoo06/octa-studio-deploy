import type { NextFunction, Request, Response } from "express";
import { TMulterFiles } from "../types/multer/multer.types";
import { TMongoIdParams } from "../types/common/common.dtos";
import { TRequestWithBlog } from "../types/express/blog";
import { TBlogDto, TGetBlogsQuery } from "../types/blog/blog.dtos";
import { BlogService } from "../services/blog.service";

export class BlogController {

    static createBlog = async (req: Request<{}, {}, TBlogDto>, res: Response, next: NextFunction) => {
        const data = req.body;
        const files = req.files as TMulterFiles;

        try {
            await BlogService.createBlog(data, files)

            return res.status(201).json({
                status: "success",
                message: "Blog created successfully"
            });

        } catch (error) {
            console.error("Error creating the blog:", error);
            next(error)
        }
    }

    static updateBlog = async (req: TRequestWithBlog<TMongoIdParams, {}, TBlogDto>, res: Response, next: NextFunction) => {
        const data = req.body

        try {
            await BlogService.updateBlog(req.Blog, data)

            return res.status(200).json({
                status: "success",
                message: "Blog updated successfully"
            });

        } catch (error) {
            console.error("Error updating the blog:", error);
            next(error)
        }
    }

    static updateBlogImage = async (req: TRequestWithBlog<TMongoIdParams>, res: Response, next: NextFunction) => {
        const files = req.files as TMulterFiles

        try {
            await BlogService.updateBlogImage(req.Blog, files)

            return res.status(200).json({
                status: "success",
                message: "Blog image updated successfully"
            });

        } catch (error) {
            console.error("Error updating the blog image:", error);
            next(error)
        }
    }

    static uploadContentImage = async (req: Request, res: Response, next: NextFunction) => {
        const files = req.files as TMulterFiles

        try {
            const { url, path } = BlogService.uploadContentImage(files)

            // TinyMCE espera `location`; `path` es la ruta relativa que queda guardada.
            return res.status(201).json({
                status: "success",
                location: url,
                path
            });

        } catch (error) {
            console.error("Error uploading the content image:", error);
            next(error)
        }
    }

    static deleteBlog = async (req: TRequestWithBlog<TMongoIdParams>, res: Response, next: NextFunction) => {
        try {
            await BlogService.deleteBlog(req.Blog)

            return res.status(200).json({
                status: "success",
                message: "Blog deleted successfully"
            });

        } catch (error) {
            console.error("Error deleting the blog:", error);
            next(error)
        }
    }

    static getBlog = async (req: TRequestWithBlog, res: Response, next: NextFunction) => {
        try {
            return res.status(200).json({
                status: "success",
                blog: req.Blog
            });

        } catch (error) {
            console.error("Error retrieving the blog:", error);
            next(error)
        }
    }

    static getBlogs = async (req: Request<{}, {}, {}, TGetBlogsQuery>, res: Response, next: NextFunction) => {
        const page = Number(req.query.page ?? 1)
        const category = req.query.category

        try {
            const { blogs, pagination } = await BlogService.getBlogs(page, category)

            return res.status(200).json({
                status: "success",
                blogs,
                pagination
            });

        } catch (error) {
            console.error("Error retrieving the blogs:", error);
            next(error)
        }
    }
}
