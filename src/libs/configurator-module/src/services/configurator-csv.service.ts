import { Configurator } from '../../../configurator/src/entities/configurator';
import { writeToBuffer } from 'fast-csv';
import { ProductId } from '../../../configurator/src/enum/product-id';
import { ProductType } from '../../../configurator/src/enum/product-type';

export class ConfiguratorCsvService {
    static async buildCsv(configurator: Configurator) {
        const writeToBufferArray = [
            [
                'Produkttyp',
                'Projektname',
                'Türbezeichnung',
                'Zylindertyp',
                'Länge innen',
                'Länge außen',
                'Benutzername',
                'Anzahl Schlüssel',
            ],
        ];

        const doors = configurator.doors;

        const productList = [];
        configurator.groups.map((group) => {
            group.doorIds.map((doorId) => {
                const door = doors.filter((door) => doorId === door.id);
                let productName;
                if (configurator.productType === ProductType.WERKSPROFIL) {
                    switch (configurator.productId) {
                        case ProductId.k6rt:
                            productName = 'K6-RT';
                            break;
                        case ProductId.t250:
                            productName = 'T250';
                            break;
                        case ProductId.k10:
                            productName = 'K-10';
                            break;
                    }
                } else {
                    switch (configurator.productId) {
                        case ProductId.k6rt:
                            productName = 'K6-SP';
                            break;
                        case ProductId.t250:
                            productName = 'T250sp';
                            break;
                        case ProductId.k10:
                            productName = 'SPK';
                            break;
                    }
                }
                productList.push([
                    configurator.productType,
                    productName,
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
            delimiter: ';',
        });
    }
}
