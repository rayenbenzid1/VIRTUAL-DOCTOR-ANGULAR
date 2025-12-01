import { Component, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages = signal<ChatMessage[]>([]);
  userMessage = signal('');
  loading = signal(false);
  userName = signal('');
  userEmail = signal('');

  private readonly BASE_URL = `${environment.BASE_URL}/health-assistant-service`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.addWelcomeMessage();
  }

  // Auto-scroll effect
  private scrollEffect = effect(() => {
    this.messages(); // Track changes
    setTimeout(() => this.scrollToBottom(), 100);
  });

  private loadUserData() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const userData = JSON.parse(user);
    this.userName.set(userData.firstName || userData.name || 'Utilisateur');
    this.userEmail.set(userData.email);
  }

  private addWelcomeMessage() {
    const welcomeMessage: ChatMessage = {
      text: `Bonjour ${this.userName()} ! Je suis votre assistant santé IA. Comment puis-je vous aider ?`,
      isUser: false,
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, welcomeMessage]);
  }

  sendMessage() {
    const text = this.userMessage().trim();
    if (!text || this.loading()) return;

    // Add user message
    const userMsg: ChatMessage = {
      text: text,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, userMsg]);
    this.userMessage.set('');
    this.loading.set(true);

    // Prepare request
    const payload = {
      email: this.userEmail(),
      prompt: text
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });

    // Send to API
    this.http.post<{ response: string }>(`${this.BASE_URL}/chat`, payload, { headers })
      .subscribe({
        next: (response) => {
          const botMsg: ChatMessage = {
            text: response.response || 'Réponse reçue...',
            isUser: false,
            timestamp: new Date()
          };
          this.messages.update(msgs => [...msgs, botMsg]);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erreur ChatBot:', error);
          const errorMsg: ChatMessage = {
            text: error.status 
              ? `Erreur ${error.status}: ${error.error?.message || 'Impossible de contacter le serveur'}` 
              : 'Pas de connexion. Vérifiez votre réseau.',
            isUser: false,
            timestamp: new Date()
          };
          this.messages.update(msgs => [...msgs, errorMsg]);
          this.loading.set(false);
        }
      });
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}