import { PdfPage } from '../PdfPage';
import PDFDocument = PDFKit.PDFDocument;
import { PdfBlock, ProductBlock } from '../PdfBlock';
import { AssetManager } from '../asset-manager';
import * as SvgToPdf from 'svg-to-pdfkit';
import { format } from 'date-fns';
import { Door } from 'src/libs/configurator/src/entities/door';
import { Group } from 'src/libs/configurator/src/entities/group';
import { ConfiguratorRequest } from 'src/libs/configurator-module/src/requests/configurator.request';
import { Key } from 'src/libs/configurator/src/entities/key';
import { KeyRequest } from 'src/libs/configurator-module/src/requests/key.request';
import { KeyBlock } from 'src/libs/configurator-module/src/services/configurator-email.service';
import * as translations from 'src/libs/shared-kernel/pdf/assets/translations.json';

export class DynamicPage extends PdfPage {
    public readonly type: 'static' | 'dynamic' = 'dynamic';
    private debug = false;
    private firstPageNumber = 1;
    private lastPageNumber = 1;

    constructor(private blocks: ProductBlock[], private configurator: KeyRequest, private lang: string) {
        super();
    }

    addBlock(block: ProductBlock) {
        this.blocks.push(block);
    }

    useDebug(use: boolean) {
        this.debug = use;
    }

    setPageNumber(number: number) {
        this.firstPageNumber = number;
    }

    setFirstPageNumber(pageNumber: number) {
        this.firstPageNumber = pageNumber;
    }

    getLastPageNumber(): number {
        return this.lastPageNumber;
    }

    async renderHeader(start: number, horizontalMargins: number, doc: PDFDocument) {
        doc.image(AssetManager.imagePath('logo-keys.jpeg'), horizontalMargins - 2, start);
    }
    async renderKeyBlocks(
        start: number,
        keys: Key[],
        productName: string,
        horizontalMargins: number,
        x: number,
        doc: PDFDocument,
    ) {
        const doorBlocksHeight = 240;

        start += 8;
        x = horizontalMargins + 8;

        keys.map((key, index) => {
            x = horizontalMargins + 8;
            start = index ? start + 16 : start;

            doc.save()
                .roundedRect(horizontalMargins, start, 490, doorBlocksHeight, 8)
                .lineWidth(0.5)
                .strokeColor('#E0E0E0')
                .stroke();

            start += 8;
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(12)
                .fillColor('#06326E')
                .text(`${translations[key.blank][this.lang]} • ${key.name}`, x, start);

            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(12)
                .fillColor('#666')
                .text(translations[`Menge`][this.lang], x + 402, start);

            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(12)
                .fillColor('#06326E')
                .text(key.menge, x + 447, start, {
                    width: 27,
                    align: 'right',
                });

            start += 24;
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(8)
                .fillColor('#828282')
                .text(translations[`Vorderseite`][this.lang], x, start);

            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(8)
                .fillColor('#828282')
                .text(translations[`Rückseite`][this.lang], x + 245, start);

            start += 24;
            doc.save().image(key.front.image, x, start, {
                height: 175,
            });

            doc.save().image(key.back.image, x + 245, start, {
                height: 175,
            });
            start += 175;
        });
    }

    async render(doc: PDFDocument) {
        // const pageHeight = 1273;
        // const pageWidth = 900;
        const pageHeight = 842;
        const pageWidth = 586;
        const tableWidth = 780;
        const verticalMarginTop = 16;
        const verticalMarginBottom = 16;
        const horizontalMargins = 48;
        let start = verticalMarginTop;
        let x = 0;
        const colors = ['#ff0000', '#00ff00', '#0000ff'];
        const blocks = [];
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            blocks.push(block);
        }
        doc.image(AssetManager.imagePath('logo-keys.jpeg'), horizontalMargins - 2, verticalMarginTop - 2, {
            width: 37,
            height: 48,
        });

        const headerAddress =
            translations['BASI GmbH \nKonstantinstraße 387\n41238 Mönchengladbach \nGermany'][this.lang];
        const emailAddress = 'info@basi.eu';
        const phone = '+49 (0) 21 66 / 98 56 -0';
        const date = new Date();
        const months = translations[`month`][this.lang];
        const currentDate =
            this.lang === 'EN'
                ? months[date.getMonth()] + format(date, ` dd, yyyy. HH:mm`)
                : format(date, `dd. `) + months[date.getMonth()] + format(date, ` yyyy, HH:mm`);

        let pageNumber: number = this.firstPageNumber;

        // HEADER BLOCK
        doc.font(AssetManager.HelveticaNeue())
            .fontSize(6)
            .fillColor('#666666')
            .text(headerAddress, horizontalMargins + 54, verticalMarginTop);

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(8)
            .fillColor('#06326E')
            .text(emailAddress, doc.page.width - 95 - horizontalMargins - 53, start + 4);

        doc.save()
            .roundedRect(doc.page.width - 88 - horizontalMargins, start - 1, 95, 16, 24)
            .lineWidth(0.5)
            .strokeColor('#06326E')
            .stroke();

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(8)
            .fillColor('#06326E')
            .text(phone, doc.page.width - horizontalMargins - 8 - 75, start + 4);

        start += 48; // logo height
        start += 24; // margin-top

        // ORDER INFO BLOCK
        x = horizontalMargins + 8;
        let orderInfoHeight = 56;
        if (this.configurator.email) {
            orderInfoHeight += 12;
        }
        if (this.configurator.phone) {
            orderInfoHeight += 12;
        }
        const startForProductBlock = start + 8 + orderInfoHeight;
        const xRight = x + 120 + 120;

        doc.save()
            .roundedRect(horizontalMargins, start, 490, orderInfoHeight, 8)
            .lineWidth(0.5)
            .strokeColor('#E0E0E0')
            .stroke();

        start += 8; // padding-top

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(12)
            .fillColor('#666666')
            .text(translations[`Anfrage`][this.lang], x, start);

        x = horizontalMargins + 144;

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(6)
            .fillColor('#666666')
            .text(translations['Ansprechpartner'][this.lang], x, start);
        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(6)
            .fillColor('#06326E')
            .text(this.configurator.name, xRight, start);
        start += 12;

        if (!this.configurator.customerNumber) {
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#666666')
                .text(translations[`Adresse`][this.lang], x, start);
            const address = `${this.configurator.street.trim()} \n${this.configurator.zip.trim()} ${this.configurator.city.trim()}`;
            doc.save().font(AssetManager.HelveticaNeue()).fontSize(6).fillColor('#06326E').text(address, xRight, start);
            start += 18;
        }

        if (this.configurator.customerNumber) {
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#666666')
                .text(translations[`Kundennummer`][this.lang], x, start);
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#06326E')
                .text(this.configurator.customerNumber, xRight, start);
            start += 12;
        }

        if (this.configurator.email) {
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#666666')
                .text(translations[`E-mail`][this.lang], x, start);
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#06326E')
                .text(this.configurator.email, xRight, start);
            start += 12;
        }

        if (this.configurator.phone) {
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#666666')
                .text(translations[`Telefonnummer`][this.lang], x, start);
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#06326E')
                .text(this.configurator.phone, xRight, start);
            start += 12;
        }

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(6)
            .fillColor('#666666')
            .text(translations[`Datum`][this.lang], x, start);
        doc.save().font(AssetManager.HelveticaNeue()).fontSize(6).fillColor('#06326E').text(currentDate, xRight, start);

        // KEYS BLOCK

        const pages = [[]];

        start += 48;
        const firstPageFilled = 64 + 24 + orderInfoHeight + 24;
        let remainingContentHeight = doc.page.height - firstPageFilled;

        const keys = [];
        const keyProductName = Object.keys(this.configurator.keys);
        for (const keyName of keyProductName) {
            this.configurator.keys[keyName].map((key) => {
                keys.push(key);
            });
        }
        keys.map((block, index) => {
            const blockHeight = 248;
            if (blockHeight <= remainingContentHeight) {
                pages[pages.length - 1].push(block);
                remainingContentHeight -= blockHeight;
            } else {
                pages.push([block]);
                remainingContentHeight = pageHeight - blockHeight - 55;
            }
        });
        for (let i = 0; i < pages.length; i++) {
            if (i > 0) {
                doc.addPage();
                start = verticalMarginTop;
            }
            await this.renderKeyBlocks(start, pages[i], this.configurator.productId, horizontalMargins, x, doc);
        }
    }
}
