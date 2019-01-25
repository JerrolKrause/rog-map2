import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { QaComponent } from './qa.component';
import { routing } from './qa.routes';
import { ChartsComponent } from './routes/charts/charts.component';
import { ChartModule, MapModule } from '$features';
import { MapComponent } from './routes/map/map.component';
import { ListingModalComponent } from './routes/mapbox/components/listing-modal/listing-modal.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, ChartModule, MapModule],
  declarations: [QaComponent, ChartsComponent, MapComponent, ListingModalComponent],
  entryComponents: [ListingModalComponent],
})
export class QaModule {}
