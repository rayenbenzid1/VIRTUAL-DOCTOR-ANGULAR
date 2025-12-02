import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLifecycleService } from './app-lifecycle.service';
import { FloatingChatbotComponent } from './shared/components/floating-chatbot/floating-chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, FloatingChatbotComponent],
})
export class AppComponent {
  constructor(private appLifecycle: AppLifecycleService) {
    // Le service s'initialise automatiquement
  }
}
