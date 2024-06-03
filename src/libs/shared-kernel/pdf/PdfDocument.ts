import { PdfPage } from './PdfPage';
import * as pdfkit from 'pdfkit';
import pdfkitType = PDFKit.PDFDocument;
import { ConfiguratorRequest } from 'src/libs/configurator-module/src/requests/configurator.request';

export class PdfDocument {
    protected pages: PdfPage[] = [];
    protected readonly doc: pdfkitType;

    constructor() {
        this.doc = new pdfkit({
            size: [586, 842],
            layout: 'portrait',
            margin: 0,
        });
    }

    addPage(page: PdfPage): this {
        this.pages.push(page);
        return this;
    }

    to(stream) {
        this.doc.pipe(stream);
    }

    render() {
        this.pages.forEach((page) => page.render(this.doc));
    }

    async renderTo(stream) {
        this.doc.pipe(stream);
        // for (let index = 0; index < this.pages.length; index++) {
        //     if (index > 0) {
        //         this.doc.addPage();
        //     }
        //     await this.pages[index].render(this.doc);
        // }
        this.doc.end();
    }
}
