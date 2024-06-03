import * as path from 'path';
import { AssetManager } from './asset-manager';
import PdfkitType = PDFKit.PDFDocument;

export abstract class PdfPage {
    protected readonly _fontAssetManager: AssetManager;
    public readonly type: 'static' | 'dynamic' = 'static';
    protected pageNumber = 1;

    abstract render(doc: PdfkitType);

    protected async renderProductTable(
        doc,
        startY,
        datas: Record<string, unknown>[],
    ): Promise<Record<string, unknown>> {
        let lastRowRect;
        const table = {
            datas: datas,
        };

        // await doc.table(table, {
        //     prepareHeader: () => {
        //         doc.font(this._fontAssetManager.getGothicFontPath()).fontSize(15).fill('#ffffff');
        //     },
        //     prepareRow: (row, indexColumn, indexRow, rectRow) => {
        //         doc.font(this._fontAssetManager.getGothicFontPath()).fontSize(15).fill('#000000');
        //     },
        //     x: 75,
        //     y: startY, //220
        //     width: doc.page.width - 75,
        //     divider: { horizontal: { disabled: true } },
        //     padding: { top: 1, right: 14, bottom: 2, left: 14 },
        // });

        doc.save()
            .translate(75, startY - 4)
            .path('M-.5 9.5c0-5.54 4.46-10 10-10h-10z')
            .fill('#ffffff')
            .restore();
        doc.save()
            .translate(doc.page.width - 75, startY - 4)
            .rotate(90)
            .path('M-.5 9.5c0-5.54 4.46-10 10-10h-10z')
            .fill('#ffffff')
            .restore();

        if (lastRowRect) {
            doc.save()
                .translate(lastRowRect.x, lastRowRect.y + lastRowRect.height)
                .rotate(270)
                .path('M-.5 9.5c0-5.54 4.46-10 10-10h-10z')
                .fill('#ffffff')
                .restore();
            doc.save()
                .translate(doc.page.width - 75, lastRowRect.y + lastRowRect.height)
                .rotate(180)
                .path('M-.5 9.5c0-5.54 4.46-10 10-10h-10z')
                .fill('#ffffff')
                .restore();
        }

        return lastRowRect;
    }

    public setPageNumber(number: number) {
        this.pageNumber = number;
    }
}
