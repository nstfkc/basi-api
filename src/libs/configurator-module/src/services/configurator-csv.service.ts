import { Configurator } from '../../../configurator/src/entities/configurator';
import { writeToBuffer } from 'fast-csv';

export class ConfiguratorCsvService {
    static async buildCsv(configurator: Configurator, delimiter = ';') {
        const head = ['Türbezeichnung', 'Zylindertyp', 'Länge innen', 'Länge außen'];

        const doors = configurator.doors;

        const list = [];

        for (const door of doors) {
            const groups = configurator.groups.filter((group) => group.doorIds.includes(door.id));
            list.push([
                door.name,
                door.type,
                door.langeInnen,
                door.langeAusen,
                ...groups.map((group) => [group.name, group.keysCount]).flat(),
            ]);
        }

        const longestRow = list.reduce((acc, row) => (row.length > acc ? row.length : acc), 0);
        const missingColumns = longestRow - head.length;
        for (let i = 0; i < missingColumns / 2; i++) {
            head.push('Benutzername');
            head.push('Anzahl Schlüssel');
        }

        return writeToBuffer([head, ...list], {
            delimiter,
            writeBOM: true,
        });
    }
}
