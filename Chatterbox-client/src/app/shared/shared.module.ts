import { NgModule } from '@angular/core';
import {PanelModule} from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import {ListboxModule} from 'primeng/listbox';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFilm, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsModule } from './icons.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    InputTextareaModule,
    IconsModule,
    ButtonModule,
    ListboxModule,
    InputTextModule,
    FormsModule,
    PanelModule,
    ReactiveFormsModule
  ],
  exports: [
    FontAwesomeModule,
    InputTextareaModule,
    IconsModule,
    ButtonModule,
    InputTextModule,
    ListboxModule,
    FormsModule,
    PanelModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {   
}