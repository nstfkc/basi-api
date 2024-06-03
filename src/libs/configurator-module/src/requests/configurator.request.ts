import { ApiProperty } from '@nestjs/swagger';
import { Door } from '../../../configurator/src/entities/door';
import { Group } from '../../../configurator/src/entities/group';
import { OrderType } from '../../../configurator/src/enum/order-type';
import { ProductType } from '../../../configurator/src/enum/product-type';

export class ConfiguratorRequest {
    @ApiProperty({ enum: OrderType })
    readonly orderType: OrderType;
    @ApiProperty({ default: 'null' })
    readonly productId: string;
    @ApiProperty({
        required: false,
        type: Door,
        isArray: true,
        default: [new Door('1', 'Tür 1', 'Doppelzylinder ohne Not- und Gefahrenfunktion', '30', '30')],
    })
    readonly doors: Door[];
    @ApiProperty({ required: false, type: Group, isArray: true, default: [new Group('1', 'Gruppe 1', 30, ['1'])] })
    readonly groups: Group[];
    @ApiProperty({ default: 'Name' })
    public name: string;
    @ApiProperty({ enum: ProductType })
    readonly productType: ProductType;
    @ApiProperty({ default: 'mail@mail.ru' })
    readonly email: string;
    @ApiProperty({ required: false })
    readonly company: string;
    @ApiProperty({ default: '+11002345678', required: false })
    readonly phone: string;
    @ApiProperty({ required: false })
    readonly city: string;
    @ApiProperty({ required: false })
    readonly street: string;
    @ApiProperty({ required: false })
    readonly zip: string;
    @ApiProperty({ default: 'mm6', required: false })
    readonly customerNumber: string;
    @ApiProperty({ required: false })
    readonly comment: string;
    readonly language: string;

    constructor(
        productId: string,
        doors: Door[],
        groups: Group[],
        name: string,
        email: string,
        phone: string,
        orderType: OrderType,
        productType: ProductType,
        city: '',
        company: '',
        street: '',
        zip: '',
        comment: '',
        customerNumber = '',
        language = 'DE',
    ) {
        this.productId = productId;
        this.doors = doors;
        this.groups = groups;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.customerNumber = customerNumber;
        this.productType = productType;
        this.orderType = orderType;
        this.company = company;
        this.city = city;
        this.street = street;
        this.zip = zip;
        this.comment = comment;
        this.customerNumber = customerNumber;
        this.language = language;
    }
}
