import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Entity, EntityType } from '../../models/entity';
import { UpdateAvailableEntities } from '../../store/actions/entity.actions';
import { AppState, selectEntityState } from '../../store/app.states';
import { Observable, Subscription } from 'rxjs';
import { EntityState } from '../../store/reducers/entity.reducers';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-add-edit',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.css'],
})
export class AddEditComponent implements OnInit, OnDestroy {
    id: string;
    isAddMode: boolean;
    entity: Entity = new Entity();
    editedEntity: Entity;
    getEntityState: Observable<EntityState>;
    availableItems: Entity[];
    errorMessage: string;
    subscriptions: Subscription = new Subscription();

    entityTypes: EntityType[] = [EntityType.THING, EntityType.CONTAINER];

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
    ) {
        this.getEntityState = this.store.select(selectEntityState);
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.subscriptions.add(
            this.getEntityState.subscribe((state) => {
                this.availableItems = [...state.availableItems];
                this.errorMessage = state.errorMessage;
            }),
        );

        if (!this.isAddMode) {
            this.editedEntity = this.findEntity(this.availableItems);
            this.entity = { ...this.editedEntity };
        }
    }

    onSubmit() {
        if (this.isAddMode) {
            const entity = {
                ...new Entity(),
                id: Math.floor(Math.random() * 100).toString(),
                type: this.entity.type,
                description: this.entity.description,
                volume: this.entity.volume,
                spentVolume: 0,
            };

            this.availableItems.push(entity);
        } else {
            this.availableItems = this.updateEntity();
        }

        this.store.dispatch(
            UpdateAvailableEntities({ payload: this.availableItems }),
        );
    }

    findEntity(availableItems: Entity[]) {
        for (const item of availableItems) {
            if (item.id === this.id) {
                return item;
            }
            if (item.items) {
                const result = this.findEntity(item.items);
                if (result) {
                    return result;
                }
            }
        }
        return undefined;
    }

    updateNested(items: Entity[]) {
        for (const item of items) {
            if (item.id === this.id) {
                return [{ ...item, ...this.entity }];
            }
            if (item.items) {
                return [{ ...item, items: this.updateNested(item.items) }];
            }
        }
        return items;
    }

    updateEntity() {
        return this.availableItems.map((availableItem) => {
            const entity = this.findEntity([availableItem]);
            if (entity) {
                return this.updateNested([availableItem])[0];
            }
            return availableItem;
        });
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
