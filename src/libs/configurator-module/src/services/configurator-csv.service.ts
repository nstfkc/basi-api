import { Configurator } from '../../../configurator/src/entities/configurator';
import { writeToBuffer } from 'fast-csv';

export class ConfiguratorCsvService {
    static async buildCsv(configurator: Configurator, delimiter = ';') {
        const writeToBufferArray = [
            ['Türbezeichnung', 'Zylindertyp', 'Länge innen', 'Länge außen', 'Benutzername', 'Anzahl Schlüssel'],
        ];

        const doors = configurator.doors;

        const productList = [];
        configurator.groups.map((group) => {
            group.doorIds.map((doorId) => {
                const door = doors.filter((door) => doorId === door.id);
                productList.push([
                    door[0].name,
                    door[0].type,
                    door[0].langeInnen,
                    door[0].langeAusen,
                    group.name,
                    group.keysCount,
                ]);
            });
        });

        productList.sort((a, b) => (a[0] < b[0] ? -1 : 1));

        return writeToBuffer(writeToBufferArray.concat(productList), {
            delimiter,
            writeBOM: true,
        });
    }
}
