export class Email {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value.toString().toLowerCase().trim();
        if (!this._value || this._value.indexOf('@') < 1) {
            throw new Error(`Wrong or empty Email: "${value}"`);
        }
    }

    get value(): string {
        return this._value;
    }

    public toString = (): string => {
        return this.value;
    };

    eq(email: Email): boolean {
        return email.value === this.value;
    }
}
