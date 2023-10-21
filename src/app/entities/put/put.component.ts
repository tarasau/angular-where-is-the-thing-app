import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, selectEntityState } from '../../store/app.states';
import { Observable, Subject } from 'rxjs';
import { EntityState } from '../../store/reducers/entity.reducers';
import { Entity, EntityType } from '../../models/entity';
import { UpdateAvailableEntities } from '../../store/actions/entity.actions';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-put',
    templateUrl: './put.component.html',
    styleUrls: ['./put.component.css'],
})
export class PutComponent implements OnInit, OnDestroy {
    getEntityState: Observable<EntityState>;
    entities: Entity[];
    putIntoEntities: Entity[];
    entity: Entity;
    putIntoEntity: Entity = new Entity();

    constructor(private store: Store<AppState>) {
        this.getEntityState = this.store.select(selectEntityState);
    }

    getEntityState$ = this.store.select(selectEntityState);
    destroyed = new Subject();

    ngOnInit(): void {
        this.getEntityState$
            .pipe(
                tap(() => this.getAvailableEntities()),
                takeUntil(this.destroyed),
            )
            .subscribe((entityState) => {
                this.entities = [...entityState.availableItems];
            });
    }

    getAvailableEntities() {
        this.putIntoEntities = this.flatAvailableEntities(
            this.entities,
        ).filter((item) => item.type !== EntityType.THING);
    }

    putEntityChange(selectedEntity) {
        this.getAvailableEntities();
        this.putIntoEntities = this.putIntoEntities.filter(
            (item) =>
                item.id !== selectedEntity.id &&
                selectedEntity.volume + item.spentVolume < item.volume,
        );
    }

    flatAvailableEntities(entities: Entity[]) {
        let items = [];

        return entities
            .map((entity) => {
                if (entity.items && entity.items.length) {
                    items = [items, ...entity.items];
                }
                return entity;
            })
            .concat(items.length ? this.flatAvailableEntities(items) : items);
    }

    putNested(items: Entity[], id: string) {
        return items.reduce((acc, item) => {
            const nestedItems = item.items || [];
            if (item.id === id) {
                return [
                    acc,
                    {
                        item,
                        spentVolume: item.spentVolume + this.entity.volume,
                        items: [nestedItems, this.entity],
                    },
                ];
            }
            return [
                acc,
                { item, items: this.putNested(nestedItems, id) },
            ];
        }, []);
    }

    putEntity(id: string) {
        return this.entities.reduce((acc, entity) => {
            if (entity.id === this.entity.id) {
                return acc;
            }
            const root = this.findEntityRoot([entity], id);
            if (root) {
                return [acc, this.putNested([root], id)];
            }
            return [acc, entity];
        }, []);
    }

    findEntityRoot(availableItems: Entity[], id: string) {
        for (const item of availableItems) {
            if (item.id === id) {
                return item;
            }
            if (item.items) {
                const result = this.findEntity(item.items, id);
                if (result) {
                    return item;
                }
            }
        }
        return undefined;
    }

    findEntity(availableItems: Entity[], id: string) {
        for (const item of availableItems) {
            if (item.id === id) {
                return item;
            }
            if (item.items) {
                const result = this.findEntity(item.items, id);
                if (result) {
                    return result;
                }
            }
        }
        return undefined;
    }

    onSubmit() {
        this.store.dispatch(
            UpdateAvailableEntities({
                payload: this.putEntity(this.putIntoEntity.id),
            }),
        );
    }

    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }
}
