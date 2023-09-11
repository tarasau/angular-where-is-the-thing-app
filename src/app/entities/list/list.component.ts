import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthState } from '../../store/reducers/auth.reducers';
import { EntityState } from '../../store/reducers/entity.reducers';
import { Entity } from '../../models/entity';
import { Store } from '@ngrx/store';
import {
    AppState,
    selectAuthState,
    selectEntityState,
    selectUser,
} from '../../store/app.states';
import { LogOut } from '../../store/actions/auth.actions';
import { UpdateAvailableEntities } from '../../store/actions/entity.actions';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
    getAuthState: Observable<AuthState>;
    getEntityState: Observable<EntityState>;
    isAuthenticated: boolean;
    errorMessage: string;
    // user: User = new User();
    entity: Entity = new Entity();
    subscriptions: Subscription = new Subscription();

    availableItems: Entity[];

    constructor(private store: Store<AppState>) {
        // this.getAuthState = this.store.select(selectAuthState);
        this.getEntityState = this.store.select(selectEntityState);
    }

    getAuthState$ = this.store.select(selectAuthState);
    user$ = this.store.select(selectUser);

    ngOnInit() {
        // this.subscriptions.add(
        //     this.getAuthState.subscribe((state) => {
        //         this.isAuthenticated = state.isAuthenticated;
        //         this.user = state.user;
        //         this.errorMessage = state.errorMessage;
        //     }),
        // );

        this.subscriptions.add(
            this.getEntityState.subscribe((state) => {
                this.availableItems = [...state.availableItems];
                this.errorMessage = state.errorMessage;
            }),
        );
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
                        ...acc.items,
                        {
                            ...item,
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
                    ...acc,
                    ...this.deleteNested([availableItem], id).items,
                ];
            }
            return [...acc, availableItem];
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
        this.subscriptions.unsubscribe();
    }
}
