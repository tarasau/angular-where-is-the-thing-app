import { NgModule } from '@angular/core';
import { CurrentStateComponent } from './current-state.component';

@NgModule({
    declarations: [CurrentStateComponent],
    exports: [CurrentStateComponent],
})
export class CurrentStateModule {
    constructor() {}
}
