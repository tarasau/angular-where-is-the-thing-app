import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Entity } from '../../models/entity';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState, selectEntityState, selectUser, } from '../../store/app.states';
import { LogOut } from '../../store/actions/auth.actions';
import { UpdateAvailableEntities } from '../../store/actions/entity.actions';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
    errorMessage: string;
    entity: Entity = new Entity();

    availableItems: Entity[];

    constructor(private store: Store<AppState>) {}

    getAuthState$ = this.store.select(selectAuthState);
    getEntityState$ = this.store.select(selectEntityState);
    user$ = this.store.select(selectUser);

    destroyed = new Subject();

    ngOnInit() {
        this.getEntityState$
            .pipe(takeUntil(this.destroyed))
            .subscribe((entityState) => {
                this.availableItems = [...entityState.availableItems];
                this.errorMessage = entityState.errorMessage;
            });
    }

    logOut(): void {
        this.store.dispatch(LogOut());
    }

    removeItem(id): void {
        this.availableItems = this.deleteEntity(id);
        this.store.dispatch(
            UpdateAvailableEntities({ payload: this.availableItems }),
        );
    }

    deleteNested(items: Entity[], id: string) {
        return items.reduce(
            (acc, item) => {
                if (item.id === id) {
                    // extract nested items before delete
                    // return [ ...acc, ...item.items ];
                    return { ...acc, removedItem: item };
                }
                const { items: newItems, removedItem } = this.deleteNested(
                    item.items || [],
                    id,
                );
                return {
                    items: [
                        acc.items,
                        {
                            item,
                            spentVolume: removedItem
                                ? item.spentVolume - removedItem.volume
                                : item.spentVolume,
                            items: newItems,
                        },
                    ],
                    removedItem,
                };
            },
            { items: [], removedItem: null },
        );
    }

    deleteEntity(id: string) {
        return this.availableItems.reduce((acc, availableItem) => {
            const root = this.findEntityRoot([availableItem], id);
            if (root) {
                return [
                    acc,
                    this.deleteNested([availableItem], id).items,
                ];
            }
            return [acc, availableItem];
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

    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }
}
