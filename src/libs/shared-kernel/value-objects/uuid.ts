import { validate, v4 } from 'uuid';

export class Uuid {
    private readonly _value: string;

    public constructor(value: string | Uuid) {
        if (value instanceof Uuid) {
            this._value = value.value;
        } else {
            if (!validate(value)) {
                throw new Error(`Wrong UUID-identifier format: [${value}]`);
            }
            this._value = value;
        }
    }

    public static fromJson(serializedUuid: { _value: string }) {
        return new Uuid(serializedUuid._value);
    }

    eq(id: Uuid): boolean {
        return this._value === id.value;
    }

    ne(id: Uuid): boolean {
        return !this.eq(id);
    }

    get value(): string {
        return this._value;
    }

    public toString(): string {
        return this.value;
    }

    static generate(): Uuid {
        return new Uuid(v4());
    }

    public toPlain(): string {
        return this.toString();
    }
}
