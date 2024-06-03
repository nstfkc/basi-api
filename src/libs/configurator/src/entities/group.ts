import { ApiProperty } from '@nestjs/swagger';

export class Group {
    @ApiProperty()
    readonly id: string;
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly keysCount: number;
    @ApiProperty()
    readonly doorIds: string[];

    constructor(id: string, name: string, keysCount: number, doorIds: string[]) {
        this.id = id;
        this.name = name;
        this.keysCount = keysCount;
        this.doorIds = doorIds;
    }
}
