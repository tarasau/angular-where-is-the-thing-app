import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../models/user';
import { AppState, selectAuthState } from '../../store/app.states';
import { SignUp } from '../../store/actions/auth.actions';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit, OnDestroy {
    user: User = new User();
    getState: Observable<any>;
    errorMessage: string | null;
    subscriptions: Subscription = new Subscription();

    constructor(private store: Store<AppState>) {
        this.getState = this.store.select(selectAuthState);
    }

    ngOnInit() {
        this.subscriptions.add(
            this.getState.subscribe((state) => {
                this.errorMessage = state.errorMessage;
            }),
        );
    }

    onSubmit(): void {
        const payload = {
            ...new User(),
            email: this.user.email,
            password: this.user.password,
        };
        this.store.dispatch(SignUp({ payload }));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
