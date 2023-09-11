import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { LayoutComponent } from './layout/layout.component';
import { EntitiesRoutingModule } from './entities-routing.module';
import { FormsModule } from '@angular/forms';
import { PutComponent } from './put/put.component';
import { Store } from '@ngrx/store';
import { InitEntities } from '../store/actions/entity.actions';
import { CurrentStateModule } from '../components/current-state/current-state.module';

@NgModule({
    declarations: [
        ListComponent,
        AddEditComponent,
        LayoutComponent,
        PutComponent,
    ],
    imports: [
        CommonModule,
        EntitiesRoutingModule,
        FormsModule,
        CurrentStateModule,
    ],
})
export class EntitiesModule {
    constructor(store$: Store) {
        store$.dispatch(InitEntities());
    }
}
