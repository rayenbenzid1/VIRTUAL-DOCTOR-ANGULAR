import { Component, signal, effect, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FloatingChatbotService } from '../../services/floating-chatbot.service';
import { filter } from 'rxjs/operators';
import { log } from 'console';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

@Component({
  selector: 'app-floating-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './floating-chatbot.component.html',
  styleUrls: ['./floating-chatbot.component.css']
})
export class FloatingChatbotComponent {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages = signal<ChatMessage[]>([]);
  userMessage = signal('');
  loading = signal(false);
  userName = signal('');
  userEmail = signal('');
  isVisible = signal(true);

  private readonly BASE_URL = `${environment.BASE_URL}/health-assistant-service`;
  private readonly STORAGE_KEY = 'chatbot_history';
  private readonly EXCLUDED_ROUTES = ['/', '/login', '/register', '/chatbot', '/admin/dashboard', '/admin/users', '/doctor/dashboard'];

  isOpen = signal(false);
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private chatbotService: FloatingChatbotService
  ) {
    this.isOpen = this.chatbotService.isOpen;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateVisibility();
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.addWelcomeMessage();
    this.updateVisibility();
  }

  private updateVisibility() {
    const currentRoute = this.router.url;
    const shouldHide = this.EXCLUDED_ROUTES.some(route => 
      currentRoute === route || currentRoute.startsWith(route + '?')
    );
    this.isVisible.set(!shouldHide);
  }

  private loadUserData() {
    // On écoute les changements dans le localStorage (même si fait depuis un autre composant)
    const checkUser = () => {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        this.userEmail.set('');
        this.userName.set('Utilisateur');
        return;
      }

      try {
        const userData = JSON.parse(userJson);

        if (userData.email) {
          this.userEmail.set(userData.email);
          this.userName.set(userData.firstName || userData.name || 'Utilisateur');
        }
      } catch (e) {
        console.error('Erreur parsing user', e);
      }
    };

    // Première vérif immédiate
    checkUser();

    // Et on écoute les futurs changements (quand l'utilisateur se connecte/déconnecte)
    window.addEventListener('storage', checkUser);
    // Ou si tu changes le localStorage dans la même page :
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      originalSetItem.apply(this, arguments as any);
      if (key === 'user') {
        checkUser();
      }
    };
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

    const email = this.userEmail();
  if (!email) {
    this.messages.update(msgs => [...msgs, {
      text: "Erreur : vous devez être connecté pour utiliser le chatbot.",
      isUser: false,
      timestamp: new Date()
    }]);
    this.loading.set(false);
    return;
  }

    const userMsg: ChatMessage = {
      text: text,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, userMsg]);
    this.userMessage.set('');
    this.loading.set(true);

    const payload = {
      email: email,
      prompt: text
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });

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
            timestamp: new Date(),
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

  closeModal() {
    this.chatbotService.close();
  }

  openModal() {
    this.chatbotService.open();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}