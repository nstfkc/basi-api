import { Door } from './door';
import { Group } from './group';
import { OrderType } from "../enum/order-type";
import { ProductType } from "../enum/product-type";

export class Configurator {
    constructor(
        readonly orderType: OrderType,
        readonly productId: string,
        readonly productType: ProductType,
        readonly doors: Door[],
        readonly groups: Group[],
        readonly name: string,
        readonly email: string,
        readonly phone: string,
        readonly customerNumber: string,
        readonly city: string,
        readonly company: string,
        readonly street: string,
        readonly zip: string,
        readonly comment: string,
    ) {}
}
