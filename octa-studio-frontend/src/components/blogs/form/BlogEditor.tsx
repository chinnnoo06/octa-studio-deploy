'use client';

import 'tinymce/tinymce';
import 'tinymce/models/dom';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.js';
import 'tinymce/skins/content/default/content.js';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/help/js/i18n/keynav/en.js';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';

import { Editor } from '@tinymce/tinymce-react';

type TBlogEditorProps = {
    id: string;
    value: string;
    onChange: (html: string) => void;
};

const uploadImage = async (blobInfo: { blob: () => Blob; filename: () => string }) => {
    const formData = new FormData();
    formData.append('blogContentImage', blobInfo.blob(), blobInfo.filename());

    const res = await fetch('/api/admin/blog-content-images', { method: 'POST', body: formData });
    const json = await res.json().catch(() => ({}));

    if (!res.ok || typeof json.location !== 'string') {
        throw new Error(json.message ?? json.errors?.[0]?.msg ?? 'No se pudo subir la imagen');
    }

    return json.location as string;
};


const CONTENT_STYLE = `
  body { font-family: Inter, system-ui, sans-serif; font-size: 18px; line-height: 1.6; color: #000000bf; max-width: 100%; }
  h2, h3, h4 { color: #18608C; font-weight: 700; margin: 20px 0 0; }
  h4 { font-weight: 600; }
  h2 { font-size: 24px; text-transform: uppercase; margin-top: 40px; }
  h3 { font-size: 20px; text-transform: uppercase; }
  h4 { font-size: 18px; }
  p, ul, ol, blockquote, table, hr { margin: 20px 0 0; }
  body > :first-child { margin-top: 0; }
  a { color: #18608C; text-decoration: underline; text-underline-offset: 4px; }
  strong, b { color: #000000; font-weight: 600; }
  ul { list-style: disc; padding-left: 24px; }
  ol { list-style: decimal; padding-left: 24px; }
  li { margin-bottom: 8px; }
  blockquote { border-left: 4px solid #18608C; padding-left: 20px; color: #18608C; font-weight: 500; }
  blockquote p { margin-top: 8px; }
  img { width: 100%; max-width: 1152px; aspect-ratio: 4 / 3; max-height: 440px; object-fit: cover; border-radius: 12px; }
  hr { border: 0; border-top: 1px solid #0000004d; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { text-align: left; color: #18608C; font-weight: 600; }
  th, td { border-bottom: 1px solid #0000004d; padding: 10px; }
`;

export const BlogEditor = ({ id, value, onChange }: TBlogEditorProps) => {
    return (
        <Editor
            id={id}
            licenseKey="gpl"
            value={value}
            onEditorChange={onChange}
            init={{
                skin: 'oxide',
                content_css: 'default',
                promotion: false,
                branding: false,
                menubar: 'file edit view insert format tools table help',
                // File se queda solo con vista previa: nuevo documento e imprimir no aplican aqui.
                menu: { file: { title: 'File', items: 'preview' } },
                plugins: 'autolink autoresize code fullscreen help image link lists preview searchreplace table visualblocks wordcount',
                toolbar:
                    'undo redo | blocks | bold italic underline strikethrough | bullist numlist blockquote | link image table | removeformat code | searchreplace preview fullscreen',
                block_formats: 'Párrafo=p; Título 2=h2; Título 3=h3; Título 4=h4',
                // Solo lo que el backend conserva al sanear; el resto no tiene sentido ofrecerlo.
                valid_elements:
                    'p,h2,h3,h4,br,hr,ul,ol,li,blockquote,strong/b,em/i,u,s,a[href|target|rel],img[src|alt|width|height],figure,figcaption,table,thead,tbody,tr,th[colspan|rowspan],td[colspan|rowspan]',
                min_height: 400,
                autoresize_bottom_margin: 20,
                // Imagenes: subida automatica al insertar, sin URLs externas ni base64.
                automatic_uploads: true,
                images_upload_handler: uploadImage,
                images_reupload: false,
                file_picker_types: 'image',
                image_dimensions: false,
                image_description: true,
                convert_urls: false,
                // Pegado desde Word y similares: solo estructura, sin estilos.
                paste_as_text: false,
                paste_block_drop: true,
                content_style: CONTENT_STYLE,
            }}
        />
    );
};
