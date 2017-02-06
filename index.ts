import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './src/auth.service';

export * from './src/auth.service';

@NgModule({
  imports: [ CommonModule ],
  declarations: [],
  exports: []
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [ AuthService ]
    };
  }
}
