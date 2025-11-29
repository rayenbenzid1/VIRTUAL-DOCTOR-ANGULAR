import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLifecycleService } from './app-lifecycle.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(private appLifecycle: AppLifecycleService) {
    // Le service s'initialise automatiquement
  }
}
