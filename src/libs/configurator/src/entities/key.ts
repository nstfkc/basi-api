import { IKeySideFont, IKeySideLogoSize, IKeyType } from '../enum/key';

export type IKeyTextType = {
    value: string;
    name: string;
    maxLength: string;
};

export type IKeySide = {
    text: IKeyTextType[];
    logo: string;
    type: IKeyType;
    font: IKeySideFont;
    size: KeySize;
    logoSize: IKeySideLogoSize;
    image: string;
};

export type KeySize = {
    A: number,
    B: number,
    C: number,
    D: number,
}

export type KeyProfiles = {
    value: string;
    name: string;
};

export class Key {
    constructor(
        readonly front: IKeySide,
        readonly back: IKeySide,
        readonly id: string,
        readonly visited: boolean,
        readonly menge: string,
        readonly blank: string,
        readonly value: string,
        readonly name: string,
    ) {}
}
