import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CompensationDisplayComponent } from './compensation-calculator/compensation-display/compensation-display.component';
import { SevenDayCompensationDisplayComponent } from './compensation-calculator/seven-day-compensation-display.component';
import {CurrencyPipe} from "@angular/common";

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ListItemComponent } from './text-content/list-item/list-item.component';
import { SublistComponent } from './text-content/sublist/sublist.component';
import { CalculatorFormComponent } from './compensation-calculator/calculator-form/calculator-form.component';
import { CalculateButtonComponent } from './compensation-calculator/calculator-form/calculate-button/calculate-button.component';
import {CompensationCalculationService} from "./compensation-calculator/compensation-calculation.service";
registerLocaleData(localeFr, 'fr');


@NgModule({
  declarations: [
    AppComponent,
    CompensationDisplayComponent,
    SevenDayCompensationDisplayComponent,
    ListItemComponent,
    SublistComponent,
    CalculatorFormComponent,
    CalculateButtonComponent,
  ],
  imports: [
    BrowserModule
  ],
   providers: [CurrencyPipe, CompensationCalculationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
