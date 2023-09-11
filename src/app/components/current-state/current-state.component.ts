import { Component, Input } from '@angular/core';
import { AuthState } from '../../store/reducers/auth.reducers';

@Component({
    selector: 'app-current-state',
    templateUrl: './current-state.component.html',
    styleUrls: ['./current-state.component.css'],
})
export class CurrentStateComponent {
    @Input()
    authState: AuthState;
}
