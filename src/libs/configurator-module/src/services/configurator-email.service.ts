import { Configurator } from '../../../configurator/src/entities/configurator';
import { Injectable } from '@nestjs/common';
import { ConfiguratorCsvService } from './configurator-csv.service';
import { SendEmailOptionsBuilder } from '../../../shared-kernel/email/email/send-email-options.builder';
import { AppConfigService } from '../../../shared-kernel/app-config/app-config.service';
import { EmailService } from '../../../shared-kernel/email/email.service';
import { EmailTemplate } from '../../../shared-kernel/email/enums/email-template.enum';
import { KeyRequest } from '../requests/key.request';
import { ConfiguratorPDFService } from './configurator-pdf.service';
import { IKeyTextType, Key, KeySize } from 'src/libs/configurator/src/entities/key';
import { IKeySideLogoSize, IKeyType } from 'src/libs/configurator/src/enum/key';
import { Email } from 'src/libs/shared-kernel/email/email';
import { ConfiguratorRequest } from '../requests/configurator.request';
import { writeFileSync } from 'fs';

export class Attachment {
    public readonly type = 'buffer';
    constructor(
        public readonly fileName: string,
        public readonly content: Buffer,
        public readonly contentType?: string,
    ) {}

    toObject() {
        return {
            filename: this.fileName,
            content: this.content,
            contentType: this.contentType,
        };
    }
}

export enum FontName {
    times = 'Times New Roman',
    arial = 'Arial',
}

type KeyBlockSide = {
    logoBuffer: Buffer | null;
    image: Buffer | null;
    text: string;
    textObj: TextObj[];
    font: FontName;
    logoSize: IKeySideLogoSize;
    size: KeySize;
    type: IKeyType;
    logoName: string;
    imageName: string;
};

type TextObj =
    | IKeyTextType
    | {
          size: string;
      };

export class KeyBlock {
    readonly front: KeyBlockSide;
    readonly back: KeyBlockSide;
    readonly blank: string;
    readonly menge: string;
    readonly name: string;
    readonly value: string;
    constructor(public readonly id: string, public readonly key: Key, public readonly productName: string) {
        this.blank = key.blank;
        this.menge = key.menge;
        this.name = key.name;
        this.value = key.value;
        const textFront = key.front.text.reduce((acc, item) => {
            return `${item.value} `;
        }, '');
        const textObjFront: TextObj[] = key.front.text.map((item, index) => {
            return {
                name: item.name,
                value: item.value,
                maxLength: item.maxLength,
                size: key.front.size[item.name],
            };
        });

        const textBack = key.back.text.reduce((acc, item) => {
            return `${item.value} `;
        }, '');
        const textObjBack: TextObj[] = key.back.text.map((item, index) => {
            return {
                name: item.name,
                value: item.value,
                maxLength: item.maxLength,
                size: key.back.size[item.name],
            };
        });
        this.front = {
            logoBuffer: key?.front?.logo ? Buffer.from(key.front.logo.slice(22), 'base64') : null,
            image: key?.front?.image ? Buffer.from(key.front.image.slice(22), 'base64') : null,
            text: textFront,
            textObj: textObjFront,
            font: FontName[key?.front?.font],
            logoSize: key?.front?.logoSize,
            size: key?.front?.size,
            type: key?.front?.type,
            logoName: `${this.name}-front-logo`,
            imageName: `${this.name}-front-image`,
        };
        this.back = {
            logoBuffer: key?.back?.logo ? Buffer.from(key.back.logo.slice(22), 'base64') : null,
            image: key?.back?.image ? Buffer.from(key.back.image.slice(22), 'base64') : null,
            text: textBack,
            textObj: textObjBack,
            font: FontName[key?.back?.font],
            size: key?.back?.size,
            logoSize: key?.back?.logoSize,
            type: key?.back?.type,
            logoName: `${this.name}-back-logo`,
            imageName: `${this.name}-back-image`,
        };
    }
}

@Injectable()
export class ConfiguratorEmailService {
    constructor(private readonly mailerService: EmailService, private readonly config: AppConfigService) {}
    async emailSend(configurator: ConfiguratorRequest): Promise<void> {
        const productNames = ['X-50', 'T250', 'K-10'];
        configurator.name = configurator.name ? this.capitalizeFirstLetter(configurator.name) : '';
        const subject = configurator.language === 'EN' ? 'Your request at BASI' : 'Ihre Anfrage bei BASI';
        const csvFile = await ConfiguratorCsvService.buildCsv(configurator, ';');
        const pdfFile = await ConfiguratorPDFService.buildPDFByConfigurator(configurator);
        const pdfFileForCompany = await ConfiguratorPDFService.buildPDFByConfigurator({
            ...configurator,
            language: 'DE',
        });
        const pdfBuffer = await pdfFile.toBuffer();
        const pdfBufferForCompany = await pdfFileForCompany.toBuffer();
        const attachmentsForCompany = [
            new Attachment('Ihre Anfrage.csv', csvFile, 'text/csv'),
            new Attachment('Ihre Anfrage.pdf', pdfBufferForCompany, 'application/pdf'),
        ];

        const attachmentsForClient = [new Attachment('Ihre Anfrage.pdf', pdfBuffer, 'application/pdf')];
        const toEmails = this.config.email.defaultToEmail.split(',').map((email) => new Email(email));
        const options = new SendEmailOptionsBuilder({
            to: toEmails,
            from: this.config.email.defaultFromEmail,
            subject: subject,
            payload: {
                name: configurator.name,
                email: configurator.email,
                city: configurator.city,
                street: configurator.street,
                zip: configurator.zip,
                comment: configurator.comment,
                orderType: configurator.orderType,
                productType: configurator.productType,
                company: configurator.company,
                phone: configurator.phone,
                customerNumber: configurator.customerNumber,
                product: productNames[configurator.productId] ?? '',
            },
            attachments: attachmentsForCompany,
        });
        // to company
        await this.mailerService.sendViaTpl(EmailTemplate.QUOTATION_REQUEST, options.build());
        options.to = new Email(configurator.email);
        options.attachments = attachmentsForClient;
        const template =
            configurator.language === 'EN'
                ? EmailTemplate.QUOTATION_REQUEST_CLIENT_EN
                : EmailTemplate.QUOTATION_REQUEST_CLIENT;
        // to client
        await this.mailerService.sendViaTpl(template, options.build());
    }

    async sendEmailKey(keyRequest: KeyRequest): Promise<void> {
        const subject = keyRequest.language === 'EN' ? 'Your request at BASI' : 'Ihre Anfrage bei BASI';
        keyRequest.name = keyRequest.name ? this.capitalizeFirstLetter(keyRequest.name) : '';
        const pdfFile = await ConfiguratorPDFService.buildPDFByKey(keyRequest);
        const pdfFileForCompany = await ConfiguratorPDFService.buildPDFByKey({
            ...keyRequest,
            language: 'DE',
        });
        const attachments: Attachment[] = [];
        const pdfBuffer = await pdfFile.toBuffer();
        const pdfBufferForCompany = await pdfFileForCompany.toBuffer();

        attachments.push(new Attachment('Ihre Anfrage.pdf', pdfBufferForCompany, 'application/pdf'));
        const files = [];
        const keyBlocks: KeyBlock[] = [];
        const keyProductName = Object.keys(keyRequest.keys);
        for (const keyName of keyProductName) {
            keyRequest.keys[keyName].map((key, index) => {
                const keyBlock = new KeyBlock(key.id, key, keyName);
                keyBlocks.push(keyBlock);
                if (keyBlock.front.logoBuffer) {
                    files.push(new Attachment(`${keyBlock.name}-front-logo.png`, keyBlock.front.logoBuffer));
                }
                if (keyBlock.front.image) {
                    files.push(new Attachment(`${keyBlock.name}-front-image.png`, keyBlock.front.image));
                }
                if (keyBlock.back.logoBuffer) {
                    files.push(new Attachment(`${keyBlock.name}-back-logo.png`, keyBlock.back.logoBuffer));
                }
                if (keyBlock.back.image) {
                    files.push(new Attachment(`${keyBlock.name}-back-image.png`, keyBlock.back.image));
                }
            });
        }
        attachments.push(...files);
        const toEmails = this.config.email.defaultToEmailKey.split(',').map((email) => new Email(email));
        const options = new SendEmailOptionsBuilder({
            to: toEmails,
            from: this.config.email.defaultFromEmail,
            subject: subject,
            payload: {
                name: keyRequest.name,
                email: keyRequest.email,
                city: keyRequest.city,
                street: keyRequest.street,
                zip: keyRequest.zip,
                comment: keyRequest.comment,
                orderType: keyRequest.orderType,
                company: keyRequest.company,
                phone: keyRequest.phone,
                customerNumber: keyRequest.customerNumber,
                keys: keyBlocks,
            },
            attachments: attachments,
        });
        const template =
            keyRequest.language === 'EN'
                ? EmailTemplate.KEY_QUOTATION_REQUEST_CLIENT_EN
                : EmailTemplate.KEY_QUOTATION_REQUEST_CLIENT;
        // to company
        await this.mailerService.sendViaTpl(EmailTemplate.KEY_QUOTATION_REQUEST, options.build());

        options.to = new Email(keyRequest.email);
        options.attachments = [new Attachment('Ihre Anfrage.pdf', pdfBuffer, 'application/pdf')];
        // to client
        await this.mailerService.sendViaTpl(template, options.build());
    }

    capitalizeFirstLetter(text: string) {
        return text
            .split(' ')
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    }
}
