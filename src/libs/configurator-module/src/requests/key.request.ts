import { Key } from 'src/libs/configurator/src/entities/key';

export type OrderType = 'Inquiry' | 'Order';

export interface KeyProducts {
    'fa-head': Key[];
    'ov-head': Key[];
    'original-head': Key[];
}
export class KeyRequest {
    name: string;
    company: string;
    street: string;
    city: string;
    zip: string;
    customerNumber: string;
    email: string;
    phone: string;
    comment: string;
    orderType: OrderType;
    productId: string;
    keys: KeyProducts;
    language = 'DE';
}
