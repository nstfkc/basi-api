import { Uuid } from './uuid';

export abstract class EntityId extends Uuid {
    public static generateId<T>(c: new (value: Uuid) => T): T {
        return new c(Uuid.generate());
    }
}
