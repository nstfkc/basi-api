import { Response as ExpressResponse } from 'express';
import { Post, Controller, Version, Body, Response, Get, Query, Header, StreamableFile } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ConfiguratorRequest } from '../requests/configurator.request';
import { ConfiguratorCsvService } from '../services/configurator-csv.service';
import { ConfiguratorEmailService } from '../services/configurator-email.service';
import { ConfiguratorPDFService } from '../services/configurator-pdf.service';
import { Key } from 'src/libs/configurator/src/entities/key';
import { KeyRequest } from '../requests/key.request';

@Controller('configurator')
export class ConfiguratorController {
    constructor(private readonly _emailService: ConfiguratorEmailService) {}

    @ApiTags('configurator')
    @Post()
    @Version('1.0')
    @ApiOperation({ summary: 'Send email with order' })
    @ApiBody({ type: ConfiguratorRequest, isArray: false })
    async sendRequest(@Body() configurator: ConfiguratorRequest) {
        try {
            await this._emailService.emailSend(configurator);
            return {
                success: true,
            };
        } catch (e) {
            throw e;
        }
    }

    @Post('keys')
    @Version('1.0')
    @ApiOperation({ summary: 'Send email with order' })
    @ApiBody({ type: KeyRequest, isArray: false })
    async sendRequestKey(@Body() configurator: KeyRequest) {
        try {
            await this._emailService.sendEmailKey(configurator);
            return {
                success: true,
            };
        } catch (e) {
            throw e;
        }
    }

    @ApiTags('configurator')
    @Post('csv')
    @Version('1.0')
    @ApiOperation({ summary: 'Get CSV file by configurator' })
    @ApiBody({ type: ConfiguratorRequest, isArray: false })
    @Header('Content-Type', 'text/csv')
    @Header('Content-Disposition', 'attachment; filename=Schließanlagenkonfigurator.csv')
    @ApiResponse({
        status: 200,
        content: { 'text/csv': { schema: { type: 'string', format: 'binary' } } },
        description: 'Content of csv file',
    })
    async getCsv(@Body() configurator: ConfiguratorRequest, @Response() response: ExpressResponse) {
        try {
            const csvFile = await ConfiguratorCsvService.buildCsv(configurator);
            return new StreamableFile(csvFile);
            // response.download(csvFile.toString());
        } catch (e) {
            throw e;
        }
    }

    @ApiTags('configurator')
    @Post('pdf')
    @Version('1.0')
    @ApiOperation({ summary: 'Get PDF file by configurator' })
    @ApiBody({ type: ConfiguratorRequest, isArray: false })
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=Schlie1.pdf')
    @ApiResponse({
        status: 200,
        content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
        description: 'Content of pdf file',
    })
    async getPDF(@Response() response: ExpressResponse, @Body() configurator: ConfiguratorRequest | KeyRequest) {
        try {
            return (await ConfiguratorPDFService.buildPDF(configurator)).renderTo(response);
        } catch (e) {
            throw e;
        }
    }

    @ApiTags('configurator')
    @Post('pdf/keys')
    @Version('1.0')
    @ApiOperation({ summary: 'Get PDF file by configurator' })
    @ApiBody({ type: ConfiguratorRequest, isArray: false })
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename=Schlie1.pdf')
    @ApiResponse({
        status: 200,
        content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
        description: 'Content of pdf file',
    })
    async sendKeyForm(@Response() response: ExpressResponse, @Body() configurator: KeyRequest) {
        try {
            return (await ConfiguratorPDFService.buildPDFByKey(configurator)).renderTo(response);
        } catch (e) {
            throw e;
        }
    }
}
