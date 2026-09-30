import fs from "fs";
import path from "path";

import { testimonialRepository } from "../repositories/testimonial.repository";
import { TMulterFiles } from "../types/multer/multer.types";
import { TTestimonialDto } from "../types/testimonial/testimonial.dtos";
import { TTestimonialDocument } from "../types/testimonial/testimonial.types";
import { deleteAllUploadedFiles } from "../utils/deleteFiles";
import { HttpError } from "../utils/error";
import { UPLOADS_PATH } from "../config/env";

const imagesDir = path.resolve(UPLOADS_PATH, "testimonials");

const deleteImageFromDisk = (name: string) => {
    const filePath = path.join(imagesDir, name)

    try {
        fs.unlinkSync(filePath)
        console.log(`Image deleted: ${name}`);
    } catch (err) {
        console.error(`Error deleting ${name}`)
    }
}

export const TestimonialService = {

    async getTestimonials() {
        return await testimonialRepository.findAll()
    },

    async createTestimonial(data: TTestimonialDto, files?: TMulterFiles) {
        try {
            const image = files?.testimonialImage?.[0]?.filename

            if (!image) {
                throw new HttpError(400, "A company image is required for the testimonial");
            }

            await testimonialRepository.createTestimonial({
                ...data,
                image
            })

        } catch (error) {
            deleteAllUploadedFiles(files);
            throw error
        }
    },

    async updateTestimonial(testimonial: TTestimonialDocument, data: TTestimonialDto) {
        testimonial.quote = data.quote
        testimonial.name = data.name
        testimonial.rating = data.rating

        await testimonial.save()
    },

    async updateTestimonialImage(testimonial: TTestimonialDocument, files?: TMulterFiles) {
        try {
            const image = files?.testimonialImage?.[0]?.filename

            if (!image) {
                throw new HttpError(400, "A company image is required for the testimonial");
            }

            const oldImage = testimonial.image

            testimonial.image = image
            await testimonial.save()

            deleteImageFromDisk(oldImage)
        } catch (error) {
            deleteAllUploadedFiles(files);
            throw error
        }
    },

    async deleteTestimonial(testimonial: TTestimonialDocument) {
        await testimonial.deleteOne()

        deleteImageFromDisk(testimonial.image)
    }
}
