export type TMulterFiles = {
    projectImages?: Express.Multer.File[]
    /** Videos del proyecto: hasta 5, opcionales. Van en uploads/projects/videos. */
    projectVideos?: Express.Multer.File[]
    /** Imagen destacada del blog: una sola. */
    blogImage?: Express.Multer.File[]
    /** Imagen suelta para el cuerpo de un blog, subida desde el editor. */
    blogContentImage?: Express.Multer.File[]
    /** Logo o foto de la empresa del testimonio: una sola. */
    testimonialImage?: Express.Multer.File[]
}
