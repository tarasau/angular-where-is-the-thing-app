import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { AuthService } from './services/auth.service';
import { AuthEffects } from './store/effects/auth.effects';
import { reducers } from './store/app.states';
import { ErrorInterceptor, TokenInterceptor, } from './services/token.interceptor';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { InitAuth } from './store/actions/auth.actions';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EntityEffects } from './store/effects/entity.effects';
import { EntityService } from './services/entity.service';

const entitiesModule = () =>
    import('./entities/entities.module').then((x) => x.EntitiesModule);

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SignUpComponent,
        LogInComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {}),
        EffectsModule.forRoot([AuthEffects, EntityEffects]),
        StoreDevtoolsModule.instrument({
            maxAge: 250,
            logOnly: false,
        }),
        RouterModule.forRoot([
            { path: 'log-in', component: LogInComponent },
            { path: 'sign-up', component: SignUpComponent },
            { path: 'entities', loadChildren: entitiesModule },
            { path: '', component: HomeComponent },
            { path: '**', redirectTo: '/' },
        ]),
    ],
    providers: [
        AuthService,
        EntityService,
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(store$: Store) {
        store$.dispatch(InitAuth());
    }
}
