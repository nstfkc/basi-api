import { PdfDocument } from './PdfDocument';
import { AssetManager } from './asset-manager';
import { DynamicPage } from './dynamic.page';

export class DynamicDocument extends PdfDocument {
    constructor() {
        super();
    }

    async renderTo(stream): Promise<void> {
        this.doc.pipe(stream);
        await this.doRender();
    }

    async toBuffer(): Promise<Buffer> {
        return new Promise(async (resolve, reject) => {
            try {
                const buffers = [];
                this.doc.on('data', buffers.push.bind(buffers));
                this.doc.on('error', () => reject('error in pdf stream'));
                this.doc.on('end', () => {
                    resolve(Buffer.concat(buffers));
                });
                await this.doRender();
            } catch (e) {
                reject(e);
            }
        });
    }

    async doRender(): Promise<void> {
        let pageNumber = 0;
        for (let index = 0; index < this.pages.length; index++) {
            const page = this.pages[index];
            pageNumber += 1;
            page.setPageNumber(pageNumber);
            await page.render(this.doc);
            if (page instanceof DynamicPage) {
                pageNumber = page.getLastPageNumber();
            }
            if (index !== this.pages.length - 1) {
                this.doc.addPage();
            }
        }
        this.doc.end();
    }
}
