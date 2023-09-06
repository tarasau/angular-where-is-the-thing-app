export class Entity {
    id: string;
    type: EntityType;
    description: string;
    volume: number;
    items?: Entity[];
    spentVolume: number;
}

export enum EntityType {
    THING = 'Thing',
    CONTAINER = 'Container',
}
