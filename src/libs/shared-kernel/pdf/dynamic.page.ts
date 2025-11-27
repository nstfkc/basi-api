import { PdfPage } from './PdfPage';
import { ProductBlock } from './PdfBlock';
import { AssetManager } from './asset-manager';
import * as SvgToPdf from 'svg-to-pdfkit';
import { format } from 'date-fns';
import { Door } from 'src/libs/configurator/src/entities/door';
import { Group } from 'src/libs/configurator/src/entities/group';
import { ConfiguratorRequest } from 'src/libs/configurator-module/src/requests/configurator.request';
import { K6_TUREN_VARIANTS } from 'src/libs/configurator/src/enum/hebelvariationen';
import * as translations from 'src/libs/shared-kernel/pdf/assets/translations.json';
import { ProductType } from '../../configurator/src/enum/product-type';
import PDFDocument = PDFKit.PDFDocument;
import { ProductId } from '../../configurator/src/enum/product-id';

export class DoorBlock {
    public height: number;
    constructor(public readonly door: Door, public readonly doc: PDFDocument) {
        doc.font(AssetManager.HelveticaNeue()).fontSize(6);
        const typeHeight = doc.heightOfString(door.type, {
            width: 218,
        });
        this.height = typeHeight + 16 + 8 + 12;
    }
}

export class GroupBlock {
    public height: number;
    private readonly doorWidth: number;
    public readonly rowWidth = 220;
    constructor(public readonly group: Group, public readonly doors: Door[], public readonly doc: PDFDocument) {
        doc.font(AssetManager.HelveticaNeue()).fontSize(6);
        this.doorWidth = group.doorIds.reduce((width, doorId) => {
            const door = doors.find((door) => door.id === doorId);
            const widthOfBlock = doc.widthOfString(door.name) + 12;
            return width + widthOfBlock;
        }, 0);
        // const rowHeight = doc.heightOfString('text', { width: this.rowWidth });
        const rowHeight = 20;
        const rows = Math.ceil(this.doorWidth / this.rowWidth);
        this.height = 12 + 12 + rows * rowHeight + (rows === 0 ? 8 : 0);
    }
}

export class DynamicPage extends PdfPage {
    public readonly type: 'static' | 'dynamic' = 'dynamic';
    private debug = false;
    private firstPageNumber = 1;
    private lastPageNumber = 1;

    constructor(private blocks: ProductBlock[], private configurator: ConfiguratorRequest, private lang: string) {
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

    async renderDoorBlocks(
        start: number,
        doorBlocks: DoorBlock[],
        horizontalMargins: number,
        x: number,
        doc: PDFDocument,
    ) {
        const doorBlocksHeight =
            8 + (doorBlocks.length - 1) * 16 + doorBlocks.reduce((height, currDoor) => height + 5 + currDoor.height, 0);
        doc.save()
            .roundedRect(horizontalMargins, start, 490, doorBlocksHeight, 8)
            .lineWidth(0.5)
            .strokeColor('#E0E0E0')
            .stroke();

        start += 8;
        x = horizontalMargins + 8;

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(12)
            .fillColor('#666666')
            .text(translations['Türen'][this.lang], x, start);

        doorBlocks.map((doorBlock, index) => {
            x = horizontalMargins + 144;
            const xRight = x + 120;
            start = index ? start + 16 + 12 : start;
            // const type = lang === 'EN' ? Translations[doorBlock.door.type] : doorBlock.door.type;
            const type = doorBlock.door.type;

            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(8)
                .fillColor('#06326E')
                .text(doorBlock.door.name, x, start);

            start += 12;
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#666666')
                .text(translations['Zylindertyp'][this.lang], x, start);
            doc.save().font(AssetManager.HelveticaNeue()).fontSize(6).fillColor('#06326E').text(type, xRight, start);

            if (
                doorBlock?.door?.langeAusen &&
                doorBlock?.door?.type !== 'Hebelzylinder' &&
                doorBlock?.door?.type !== 'Außenzylinder' &&
                doorBlock?.door?.type !== 'Lever cylinder' &&
                doorBlock?.door?.type !== 'External cylinder' &&
                doorBlock?.door?.type !== 'Vorhangschloss (VHS)' &&
                doorBlock?.door?.type !== 'Padlock (VHS)'
            ) {
                start += 12;
                doc.save()
                    .font(AssetManager.HelveticaNeue())
                    .fontSize(6)
                    .fillColor('#666666')
                    .text(translations['Länge außen'][this.lang], x, start);
                doc.save()
                    .font(AssetManager.HelveticaNeue())
                    .fontSize(6)
                    .fillColor('#06326E')
                    .text(`${doorBlock.door.langeAusen} mm`, xRight, start);
            }
            if (
                doorBlock?.door?.langeInnen &&
                doorBlock?.door?.type !== 'Hebelzylinder' &&
                doorBlock?.door?.type !== 'Außenzylinder' &&
                doorBlock?.door?.type !== 'Lever cylinder' &&
                doorBlock?.door?.type !== 'External cylinder' &&
                doorBlock?.door?.type !== 'Vorhangschloss (VHS)' &&
                doorBlock?.door?.type !== 'Padlock (VHS)'
            ) {
                start += 12;
                doc.save()
                    .font(AssetManager.HelveticaNeue())
                    .fontSize(6)
                    .fillColor('#666666')
                    .text(translations['Länge innen'][this.lang], x, start);
                doc.save()
                    .font(AssetManager.HelveticaNeue())
                    .fontSize(6)
                    .fillColor('#06326E')
                    .text(`${doorBlock.door.langeInnen} mm`, xRight, start);
            }
            if (
                doorBlock?.door?.bugelhohe &&
                (doorBlock?.door?.type === 'Vorhangschloss (VHS)' || doorBlock?.door?.type === 'Padlock (VHS)')
            ) {
                start += 12;
                doc.save()
                    .font(AssetManager.HelveticaNeue())
                    .fontSize(6)
                    .fillColor('#666666')
                    .text(translations['Bügelhöhe'][this.lang], x, start);
                doc.save()
                    .font(AssetManager.HelveticaNeue())
                    .fontSize(6)
                    .fillColor('#06326E')
                    .text(`${doorBlock.door.bugelhohe}`, xRight, start);
            }
            if (doorBlock?.door?.hebelvariationen && doorBlock?.door?.type === 'Hebelzylinder') {
                start += 12;
                doc.save()
                    .font(AssetManager.HelveticaNeue())
                    .fontSize(6)
                    .fillColor('#666666')
                    .text(translations['Hebelvariationen'][this.lang], x, start);
                doc.save()
                    .font(AssetManager.HelveticaNeue())
                    .fontSize(6)
                    .fillColor('#06326E')
                    .text(
                        translations[`${K6_TUREN_VARIANTS[doorBlock.door.hebelvariationen]}`][this.lang],
                        xRight,
                        start,
                        {
                            width: 200,
                        },
                    );
            }
        });
    }

    async renderGroupBlocks(
        doc: PDFDocument,
        groupBlocks: GroupBlock[],
        horizontalMargins: number,
        start: number,
        x: number,
    ) {
        const groupBlocksHeight = groupBlocks.reduce((height, groupBlock) => height + groupBlock.height, 0);
        doc.save()
            .roundedRect(horizontalMargins, start, 490, groupBlocksHeight, 8)
            .lineWidth(0.5)
            .strokeColor('#E0E0E0')
            .stroke();

        start += 8;
        x = horizontalMargins + 8;

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(12)
            .fillColor('#666666')
            .text(translations['Gruppen'][this.lang], x, start);

        groupBlocks.map((groupBlock, index) => {
            x = horizontalMargins + 144;
            const xRight = x + 120;
            start = index ? start + 20 : start;
            // const debugModeStart = start;
            // doc.save()
            //     .roundedRect(horizontalMargins + 144, debugModeStart, 200, groupBlock.height, 8)
            //     .lineWidth(0.5)
            //     .strokeColor('#ff0000')
            //     .stroke();

            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(8)
                .fillColor('#06326E')
                .text(groupBlock.group.name, x, start);

            start += 12;
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#666666')
                .text(translations['Anzahl Schlüssel'][this.lang], x, start);
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#06326E')
                .text(groupBlock.group.keysCount.toString(), xRight, start);

            if (groupBlock.group.doorIds?.length) {
                start += 12;
            }

            const doorSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <g clip-path="url(#clip0_362_1813)">
                        <path d="M0.666664 2.00001C0.666664 1.26363 1.26362 0.666672 2 0.666672H6C6.73638 0.666672 7.33333 1.26363 7.33333 2.00001V6.00001C7.33333 6.73638 6.73638 7.33334 6 7.33334H2C1.26362 7.33334 0.666664 6.73638 0.666664 6.00001V2.00001Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6 1.16667H2C1.53976 1.16667 1.16666 1.53977 1.16666 2.00001V6.00001C1.16666 6.46024 1.53976 6.83334 2 6.83334H6C6.46024 6.83334 6.83333 6.46024 6.83333 6.00001V2.00001C6.83333 1.53977 6.46024 1.16667 6 1.16667ZM2 0.666672C1.26362 0.666672 0.666664 1.26363 0.666664 2.00001V6.00001C0.666664 6.73638 1.26362 7.33334 2 7.33334H6C6.73638 7.33334 7.33333 6.73638 7.33333 6.00001V2.00001C7.33333 1.26363 6.73638 0.666672 6 0.666672H2Z" fill="#E20031"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.06904 2.59763C6.19921 2.72781 6.19921 2.93886 6.06904 3.06904L3.5 5.63807L1.93097 4.06904C1.80079 3.93886 1.80079 3.72781 1.93097 3.59763C2.06114 3.46746 2.2722 3.46746 2.40237 3.59763L3.5 4.69526L5.59763 2.59763C5.72781 2.46746 5.93886 2.46746 6.06904 2.59763Z" fill="#E20031"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_362_1813">
                            <rect width="8" height="8" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            `;
            let currentRowWidth = 0;
            const doorSvgStart = x;
            groupBlock.group.doorIds.map((doorId, index) => {
                const door = groupBlock.doors.find((door) => door.id === doorId);
                doc.font(AssetManager.HelveticaNeue()).fontSize(6);
                const nameWidth = doc.widthOfString(door.name) + 12;
                if (!index) {
                    x -= nameWidth;
                }
                if (currentRowWidth + nameWidth < groupBlock.rowWidth) {
                    currentRowWidth += nameWidth;
                    x += nameWidth;
                } else {
                    currentRowWidth = 0;
                    x = doorSvgStart;
                    start += 12;
                }
                SvgToPdf(doc, doorSvg, x, start - 1, {
                    width: 8,
                    height: 8,
                });
                x += 12;
                doc.save()
                    .font(AssetManager.HelveticaNeue())
                    .fontSize(6)
                    .fillColor('#E20031')
                    .text(door.name, x, start);
            });
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
        doc.image(AssetManager.imagePath('logo-full.png'), horizontalMargins - 2, verticalMarginTop - 2, {
            width: 37,
            height: 48,
        });

        const headerAddress = 'BASI Schließsysteme GmbH \nKonstantinstraße 387 \n41238 Mönchengladbach \nGermany';
        const emailAddress = 'schliesssysteme@basi.eu';
        const phone = '+49 (0) 2166 / 9857 - 0';
        const date = new Date();
        const months = translations.month[this.lang];
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
            .text(emailAddress, doc.page.width - 140 - horizontalMargins - 53, start + 4);

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
            .text(translations['Anfrage'][this.lang], x, start);

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
                .text(translations['Adresse'][this.lang], x, start);
            const address = `${this.configurator.street.trim()} \n${this.configurator.zip.trim()} ${this.configurator.city.trim()}`;
            doc.save().font(AssetManager.HelveticaNeue()).fontSize(6).fillColor('#06326E').text(address, xRight, start);
            start += 18;
        }

        if (this.configurator.customerNumber) {
            doc.save()
                .font(AssetManager.HelveticaNeue())
                .fontSize(6)
                .fillColor('#666666')
                .text(translations['Kundennummer'][this.lang], x, start);
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
                .text(translations['E-mail'][this.lang], x, start);
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
                .text(translations['Telefonnummer'][this.lang], x, start);
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
            .text(translations['Datum'][this.lang], x, start);
        doc.save().font(AssetManager.HelveticaNeue()).fontSize(6).fillColor('#06326E').text(currentDate, xRight, start);

        // PRODUCT BLOCK

        start = startForProductBlock + 24; // margin-top
        // start+=8; // padding-top

        x = horizontalMargins + 8;

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(12)
            .fillColor('#666666')
            .text(translations['Produkt'][this.lang], x, start);

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(12)
            .fillColor('#666666')
            .text(translations['Produkttyp'][this.lang], x, start + 20);

        let productImage;
        let productName;
        if (this.configurator.productType === ProductType.WERKSPROFIL) {
            switch (this.configurator.productId) {
                case ProductId.x50:
                    productImage = 'x50.jpg';
                    productName = 'X-50';
                    break;
                case ProductId.t250:
                    productImage = 't250.jpg';
                    productName = 'T250';
                    break;
                case ProductId.k10:
                    productName = 'K-10';
                    productImage = 'k10.jpg';
                    break;
            }
        } else {
            switch (this.configurator.productId) {
                case ProductId.x50:
                    productName = 'X50sp';
                    productImage = 'X50sp.jpg';
                    break;
                case ProductId.t250:
                    productName = 'T250sp';
                    productImage = 't250sp.jpg';
                    break;
                case ProductId.k10:
                    productName = 'SPK';
                    productImage = 'kt10sp.jpg';
                    break;
            }
        }
        x += 80;
        doc.save().font(AssetManager.HelveticaNeue()).fontSize(12).fillColor('#06326E').text(productName, x, start);

        doc.save()
            .font(AssetManager.HelveticaNeue())
            .fontSize(12)
            .fillColor('#06326E')
            .text(translations[this.configurator.productType][this.lang], x, start + 20);

        doc.image(AssetManager.imagePath(productImage), doc.page.width - horizontalMargins - 8 - 110, start, {
            width: 90,
            height: 90,
        });
        start += 88;

        // DOORS BLOCK

        const doorBlocks = this.configurator.doors.map((door) => {
            return new DoorBlock(door, doc);
        });
        const doorBlocksHeight =
            (doorBlocks.length - 1) * 16 +
            doorBlocks.reduce((height, currDoor) => height + currDoor.height, 0) +
            16 +
            8;

        const pages = [[]];

        start += 24;
        const firstPageFilled = 64 + orderInfoHeight + 24 + 88 + 24 - 100;
        let remainingContentHeight = doc.page.height - firstPageFilled;

        doorBlocks.map((block, index) => {
            const blockHeight = block.height + 36;
            if (blockHeight <= remainingContentHeight) {
                pages[pages.length - 1].push(block);
                remainingContentHeight -= blockHeight;
            } else {
                pages.push([block]);
                remainingContentHeight = pageHeight - block.height;
            }
        });
        for (let i = 0; i < pages.length; i++) {
            if (i > 0) {
                doc.addPage();
                start = verticalMarginTop;
            }
            await this.renderDoorBlocks(start, pages[i], horizontalMargins, x, doc);
        }

        if (pages.length === 1) {
            remainingContentHeight -= 80;
        }
        start = doc.page.height - remainingContentHeight + 24;
        if (doorBlocks.length === 1) {
            start += 12;
        }

        // Groups block;

        const groupBlocks = this.configurator.groups.map((group) => {
            return new GroupBlock(group, this.configurator.doors, doc);
        });

        let remainingContentHeightForGroup = remainingContentHeight;
        if (groupBlocks && remainingContentHeightForGroup < groupBlocks[0].height) {
            doc.addPage();
            start = verticalMarginTop + 50;
        }
        const groupPages =
            groupBlocks.length === 1 && groupBlocks[0].height > remainingContentHeightForGroup ? [] : [[]];
        groupBlocks.map((block, index) => {
            const blockHeight = block.height;
            if (blockHeight <= remainingContentHeightForGroup) {
                groupPages[groupPages.length - 1].push(block);
                remainingContentHeightForGroup -= blockHeight + 8;
            } else {
                groupPages.push([block]);
                remainingContentHeightForGroup = pageHeight - block.height;
            }
        });

        for (let i = 0; i < groupPages.length; i++) {
            if (i > 0) {
                doc.addPage();
                start = verticalMarginTop;
            }
            await this.renderGroupBlocks(doc, groupPages[i], horizontalMargins, start, x);
        }
    }
}
