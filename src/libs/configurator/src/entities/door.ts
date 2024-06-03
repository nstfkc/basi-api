import { ApiProperty } from '@nestjs/swagger';

export class Door {
    @ApiProperty()
    readonly id: string;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly type: string;
    @ApiProperty()
    readonly langeAusen: string;
    @ApiProperty()
    readonly langeInnen: string;
    @ApiProperty()
    readonly bugelhohe: string;
    @ApiProperty()
    readonly hebelvariationen: string;
    constructor(
        id: string,
        name: string,
        type: string,
        langeAusen: string,
        langeInnen: string,
        bugelhohe = '',
        hebelvariationen = '',
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.langeAusen = langeAusen;
        this.langeInnen = langeInnen;
        this.bugelhohe = bugelhohe;
        this.hebelvariationen = hebelvariationen;
    }
}
