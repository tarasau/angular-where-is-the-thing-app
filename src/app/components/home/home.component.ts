import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../../store/app.states';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {
    constructor(private store: Store<AppState>) {}

    getAuthState$ = this.store.select(selectAuthState);
}
