/*
    Service for generate pdf file with pdfkit library
    Use Configurator class for generate pdf file
*/

import { PdfBlock, ProductBlock } from 'src/libs/shared-kernel/pdf/PdfBlock';
import { DynamicDocument } from 'src/libs/shared-kernel/pdf/dynamic.document';
import { DynamicPage as DynamicPageKey } from 'src/libs/shared-kernel/pdf/pages/key.dynamic.page';
import { DynamicPage } from 'src/libs/shared-kernel/pdf/dynamic.page';
import { ConfiguratorRequest } from '../requests/configurator.request';
import { Key } from 'src/libs/configurator/src/entities/key';
import { KeyRequest } from '../requests/key.request';

export class ConfiguratorPDFService {
    static async buildPDF(configurator: ConfiguratorRequest | KeyRequest) {
        switch (true) {
            case configurator instanceof ConfiguratorRequest:
                return await ConfiguratorPDFService.buildPDFByConfigurator(
                    configurator as unknown as ConfiguratorRequest,
                );
            case configurator instanceof KeyRequest:
                return await ConfiguratorPDFService.buildPDFByKey(configurator as KeyRequest);
            default:
                throw new Error('Unknown type');
        }
    }

    static async buildPDFByConfigurator(configurator: ConfiguratorRequest) {
        const dynamicDocument = new DynamicDocument();
        const blocks = [new ProductBlock('test', 1)];
        dynamicDocument.addPage(new DynamicPage(blocks, configurator, configurator.language));
        return dynamicDocument;
    }

    static async buildPDFByKey(key: KeyRequest) {
        const dynamicDocument = new DynamicDocument();
        const blocks = [new ProductBlock('test', 1)];
        dynamicDocument.addPage(new DynamicPageKey(blocks, key, key.language));
        return dynamicDocument;
    }
}
