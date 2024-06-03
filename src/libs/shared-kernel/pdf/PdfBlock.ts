import PdfDocument = PDFKit.PDFDocument;

export type Geometry = {
    boundingRect: Rect;
    position: Coordinate;
};

export type Rect = {
    width: number;
    height: number;
};

export type Coordinate = {
    x: number;
    y: number;
};

export type RenderParams = {
    start: Coordinate;
    width: number;
};

export type RowRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export abstract class PdfBlock {
    public margin: number;

    abstract render(doc: PdfDocument, renderParams?: RenderParams): Promise<Geometry>;

    abstract boundingRect(renderParams: RenderParams): Rect;
}

export class ProductBlock extends PdfBlock {
    protected headerStyle: 'small' | 'regular' | 'none' = 'regular';

    public margin = 35;

    constructor(
        protected readonly productName: string,
        protected readonly productQuantity: number,
    ) {
        super();
    }

    setHeaderStyle(headerStyle: 'small' | 'regular' | 'none') {
        this.headerStyle = headerStyle;
        return this;
    }

    getProductData() {
        const data = {
            productName: this.productName,
        };
        return data;
    }

    async render(doc: PdfDocument, params: RenderParams): Promise<Geometry> {
        const tableParams = { ...params };
        tableParams.start.y = tableParams.start.y + this.getHeaderHeight();
        const geometry = await this.renderProductTable(doc, tableParams);
        return {
            position: params.start,
            boundingRect: {
                width: geometry.boundingRect.width,
                height: this.getHeaderHeight() + geometry.boundingRect.height,
            },
        };
    }

    boundingRect(renderParams: RenderParams): Rect {
        let height = 0;
        height += this.getHeaderHeight();
        const tableRect = this.getProductTableSize(renderParams);
        height += tableRect.height;
        return { width: renderParams.width, height: height };
    }

    protected async renderProductTable(
        doc,
        params: RenderParams
    ): Promise<Geometry> {
        let lastRowRect: RowRect;
        let previousName: string;

        doc.save()
            .translate(params.start.x + 0.2, params.start.y - 4)
            .path('M-.5 9.5c0-5.54 4.46-10 10-10h-10z')
            .fill('#ffffff')
            .restore();
        doc.save()
            .translate(params.start.x + params.width - 0.2, params.start.y - 4)
            .rotate(90)
            .path('M-.5 9.5c0-5.54 4.46-10 10-10h-10z')
            .fill('#ffffff')
            .restore();

        if (lastRowRect) {
            doc.save()
                .translate(lastRowRect.x + 0.2, lastRowRect.y + lastRowRect.height - 0.4)
                .rotate(270)
                .path('M-.5 9.5c0-5.54 4.46-10 10-10h-10z')
                .fill('#ffffff')
                .restore();
            doc.save()
                .translate(params.start.x + params.width - 0.2, lastRowRect.y + lastRowRect.height - 0.4)
                .rotate(180)
                .path('M-.5 9.5c0-5.54 4.46-10 10-10h-10z')
                .fill('#ffffff')
                .restore();
        }

        return {
            position: params.start,
            boundingRect: {
                // width: lastRowRect.width,
                // height: lastRowRect.height + lastRowRect.y - params.start.y,
                width: params.width,
                height: 200
            },
        };
    }

    protected getProductTableSize(params: RenderParams): Rect {
        let tableHeight = 23;
        // tableHeight += items.reduce((accumulator: number) => {
        //     const lines = product.details.split('\n');
        //     const numberOfLines: number = lines.length;
        //     const [detailsAddCellPadding, detailsLinesHeight] = this.getLineHeight(lines, 52);
        //     const [nameAddCellPadding, nameLinesHeight] = this.getLineHeight([product.name], 25);
        //     const addCellPadding = Math.max(detailsAddCellPadding, nameAddCellPadding);
        //     const linesHeight = Math.max(detailsLinesHeight, nameLinesHeight);
        //     return accumulator + linesHeight + addCellPadding + (numberOfLines === 1 ? 9 : 0);
        // }, 0);

        return { width: params.width, height: tableHeight };
    }

    private getLineHeight(lines: string[], countSymbolsInLine: number): number[] {
        const lineHeight = 13;
        let addCellPadding = lineHeight * 1.7;
        // const linesHeight = lines.reduce((height: number, line: string) => {
        //     const countLines = _.chunk(line, countSymbolsInLine).length;
        //     if (countLines > 1) {
        //         addCellPadding = lineHeight * 0.34;
        //     }
        //     return height + countLines * lineHeight;
        // }, 0);
        const linesHeight = 12;
        return [addCellPadding, linesHeight];
    }

    protected getHeaderHeight(): number {
        return this.headerStyle === 'none' ? 0 : this.headerStyle === 'small' ? 27 : 42; // It must be 32;
    }
}