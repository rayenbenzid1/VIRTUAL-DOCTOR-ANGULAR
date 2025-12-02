import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

interface OrganData {
  name: string;
  status: string;
  icon: string;
  color: string;
  statusColor: string;
  details: string;
  metrics: { label: string; value: string }[];
}

interface BiometricData {
  avgHeartRate?: number;
  heartRate?: any[];
  oxygenSaturation?: any[];
  bodyTemperature?: any[];
  totalSteps?: number;
  stressScore?: number;
  totalSleepHours?: string;
}

@Component({
  selector: 'app-three-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-3d-wrapper">
      <div class="canvas-container">
        <canvas #canvas3d></canvas>
        <div class="interaction-hint">
          🖱️ Cliquez et faites glisser pour faire pivoter • Molette pour zoomer
        </div>
      </div>

      <div class="avatar-info">
        <div class="info-header">
          <h2>Avatar Santé 3D</h2>
          <p class="info-subtitle">
            {{ activeOrgan() ? 'Détails du système sélectionné' : 'Cliquez sur un organe pour plus d\'informations' }}
          </p>
        </div>

        <div *ngIf="activeOrgan(); else defaultMessage" class="organ-detail-card">
          <div class="organ-card-header">
            <span class="organ-card-icon">{{ organData()[activeOrgan()!].icon }}</span>
            <h3>{{ organData()[activeOrgan()!].name }}</h3>
          </div>

          <div class="status-badge"
               [style.background]="organData()[activeOrgan()!].statusColor + '15'"
               [style.color]="organData()[activeOrgan()!].statusColor">
            <span class="status-icon">{{ getStatusIcon(organData()[activeOrgan()!].status) }}</span>
            {{ organData()[activeOrgan()!].status }}
          </div>

          <div class="organ-metrics">
            <div class="metric-row" *ngFor="let metric of organData()[activeOrgan()!].metrics">
              <span class="metric-label">{{ metric.label }}</span>
              <span class="metric-value">{{ metric.value }}</span>
            </div>
          </div>

          <p class="organ-details">{{ organData()[activeOrgan()!].details }}</p>
        </div>

        <ng-template #defaultMessage>
          <div class="default-message">
            <div class="default-message-icon">🏥</div>
            <h3>Exploration de votre santé</h3>
            <p>Cliquez sur les organes colorés du modèle 3D pour consulter vos données biométriques en temps réel</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .avatar-3d-wrapper {
      display: flex;
      gap: 32px;
      align-items: stretch;
      flex-wrap: wrap;
      padding: 24px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 24px;
      min-height: 600px;
    }

    .canvas-container {
      flex: 1;
      min-width: 400px;
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.2);
    }

    canvas {
      width: 100% !important;
      height: 600px !important;
      display: block;
      cursor: grab;
    }

    canvas:active {
      cursor: grabbing;
    }

    .interaction-hint {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      background: rgba(0, 0, 0, 0.6);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      backdrop-filter: blur(10px);
      white-space: nowrap;
    }

    .avatar-info {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-header {
      color: white;
      text-align: center;
      padding-bottom: 16px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .info-header h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .info-subtitle {
      color: #94a3b8;
      font-size: 14px;
      margin: 0;
    }

    .organ-detail-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      color: white;
      transition: all 0.3s ease;
    }

    .organ-detail-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .organ-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .organ-card-icon {
      font-size: 32px;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    }

    .organ-card-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .status-icon {
      font-size: 16px;
    }

    .organ-metrics {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .metric-row {
      display: flex;
      justify-content: space-between;
      color: #e2e8f0;
      font-size: 14px;
    }

    .metric-label {
      color: #cbd5e1;
    }

    .organ-details {
      color: #cbd5e1;
      font-size: 14px;
      line-height: 1.6;
    }

    .default-message {
      text-align: center;
      color: #cbd5e1;
      padding: 40px 20px;
    }

    .default-message-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .default-message h3 {
      margin: 0 0 12px 0;
      color: white;
      font-size: 20px;
    }

    .default-message p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .avatar-3d-wrapper {
        flex-direction: column;
      }

      .canvas-container {
        min-width: 100%;
      }

      canvas {
        height: 400px !important;
      }
    }
  `]
})
export class ThreeAvatarComponent implements OnInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() biometricData?: BiometricData | null;

  activeOrgan = signal<string | null>(null);
  hoveredOrgan = signal<string | null>(null);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private humanBody!: THREE.Group;
  
  // Organes
  private heartMesh!: THREE.Mesh;
  private brainMesh!: THREE.Mesh;
  private lungsMesh!: THREE.Group;
  private stomachMesh!: THREE.Mesh;
  private musclesMesh!: THREE.Group;

  // Interaction
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private isMouseDown = false;
  private mouseX = 0;
  private mouseY = 0;
  private targetRotationX = 0;
  private targetRotationY = 0;
  private currentRotationX = 0;
  private currentRotationY = 0;

  private animationId?: number;

  ngOnInit(): void {
    this.initThreeJS();
    this.createHumanBody();
    this.setupEventListeners();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer?.dispose();
  }

  private initThreeJS(): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);

    // Camera
    const canvas = this.canvasRef.nativeElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 1, 5);
    this.camera.lookAt(0, 1, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x667eea, 0.5);
    pointLight1.position.set(-3, 2, 2);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x764ba2, 0.5);
    pointLight2.position.set(3, 2, 2);
    this.scene.add(pointLight2);
  }

  private createHumanBody(): void {
    this.humanBody = new THREE.Group();

    // Tête
    const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0xffdbac,
      shininess: 30
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    head.castShadow = true;
    head.userData = { name: 'head', type: 'head' };
    this.humanBody.add(head);

    // Cerveau
    const brainGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const brainMaterial = new THREE.MeshPhongMaterial({
      color: 0xc4b5fd,
      emissive: 0xa78bfa,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8
    });
    this.brainMesh = new THREE.Mesh(brainGeometry, brainMaterial);
    this.brainMesh.position.copy(head.position);
    this.brainMesh.userData = { name: 'brain', type: 'organ', organKey: 'brain' };
    this.humanBody.add(this.brainMesh);

    // Cou
    const neckGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16);
    const neckMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 1.7;
    neck.castShadow = true;
    this.humanBody.add(neck);

    // Torse
    const torsoGeometry = new THREE.CylinderGeometry(0.35, 0.3, 0.9, 16);
    const torsoMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.y = 1.1;
    torso.castShadow = true;
    this.humanBody.add(torso);

    // Cœur
    const heartGeometry = new THREE.SphereGeometry(0.12, 32, 32);
    const heartMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6b9d,
      emissive: 0xff0000,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9
    });
    this.heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    this.heartMesh.position.set(-0.1, 1.2, 0.35);
    this.heartMesh.userData = { name: 'heart', type: 'organ', organKey: 'heart' };
    this.humanBody.add(this.heartMesh);

    // Poumons
    this.lungsMesh = new THREE.Group();
    const lungGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const lungMaterial = new THREE.MeshPhongMaterial({
      color: 0x7dd3fc,
      emissive: 0x4facfe,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.7
    });

    const leftLung = new THREE.Mesh(lungGeometry, lungMaterial);
    leftLung.position.set(0.2, 1.2, 0.25);
    leftLung.scale.set(0.8, 1.2, 0.6);
    leftLung.userData = { name: 'leftLung', type: 'organ', organKey: 'lungs' };
    this.lungsMesh.add(leftLung);

    const rightLung = new THREE.Mesh(lungGeometry, lungMaterial.clone());
    rightLung.position.set(-0.25, 1.2, 0.25);
    rightLung.scale.set(0.8, 1.2, 0.6);
    rightLung.userData = { name: 'rightLung', type: 'organ', organKey: 'lungs' };
    this.lungsMesh.add(rightLung);

    this.humanBody.add(this.lungsMesh);

    // Estomac
    const stomachGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const stomachMaterial = new THREE.MeshPhongMaterial({
      color: 0xffd93d,
      emissive: 0xffa500,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.7
    });
    this.stomachMesh = new THREE.Mesh(stomachGeometry, stomachMaterial);
    this.stomachMesh.position.set(0, 0.85, 0.25);
    this.stomachMesh.scale.set(1, 0.8, 0.8);
    this.stomachMesh.userData = { name: 'stomach', type: 'organ', organKey: 'stomach' };
    this.humanBody.add(this.stomachMesh);

    // Bras
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(0.45, 1.1, 0);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    this.humanBody.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(-0.45, 1.1, 0);
    rightArm.rotation.z = -0.3;
    rightArm.castShadow = true;
    this.humanBody.add(rightArm);

    // Muscles (bras)
    this.musclesMesh = new THREE.Group();
    const muscleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const muscleMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6b6b,
      emissive: 0xff0000,
      emissiveIntensity: 0.2
    });

    const leftMuscle = new THREE.Mesh(muscleGeometry, muscleMaterial);
    leftMuscle.position.set(0.45, 1.3, 0);
    leftMuscle.scale.set(1.2, 0.8, 0.8);
    this.musclesMesh.add(leftMuscle);

    const rightMuscle = new THREE.Mesh(muscleGeometry, muscleMaterial.clone());
    rightMuscle.position.set(-0.45, 1.3, 0);
    rightMuscle.scale.set(1.2, 0.8, 0.8);
    this.musclesMesh.add(rightMuscle);

    this.humanBody.add(this.musclesMesh);

    // Bassin
    const pelvisGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.3, 16);
    const pelvisMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
    const pelvis = new THREE.Mesh(pelvisGeometry, pelvisMaterial);
    pelvis.position.y = 0.5;
    pelvis.castShadow = true;
    this.humanBody.add(pelvis);

    // Jambes
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.09, 1, 16);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(0.15, 0, 0);
    leftLeg.castShadow = true;
    this.humanBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(-0.15, 0, 0);
    rightLeg.castShadow = true;
    this.humanBody.add(rightLeg);

    this.humanBody.position.y = 0.5;
    this.scene.add(this.humanBody);

    this.updateHealthIndicators();
  }

  private setupEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('mouseup', () => this.onMouseUp());
    canvas.addEventListener('wheel', (e) => this.onWheel(e));
    canvas.addEventListener('click', (e) => this.onCanvasClick(e));

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private onMouseDown(event: MouseEvent): void {
    this.isMouseDown = true;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isMouseDown) return;
    
    const deltaX = event.clientX - this.mouseX;
    const deltaY = event.clientY - this.mouseY;
    
    this.targetRotationY += deltaX * 0.01;
    this.targetRotationX += deltaY * 0.01;
    this.targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetRotationX));
    
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private onMouseUp(): void {
    this.isMouseDown = false;
  }

  private onWheel(event: WheelEvent): void {
    event.preventDefault();
    this.camera.position.z += event.deltaY * 0.005;
    this.camera.position.z = Math.max(2, Math.min(10, this.camera.position.z));
  }

  private onCanvasClick(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const allObjects: THREE.Object3D[] = [];
    this.humanBody.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        allObjects.push(child);
      }
    });

    const intersects = this.raycaster.intersectObjects(allObjects, false);
    if (intersects.length > 0) {
      const object = intersects[0].object;
      const organKey = object.userData['organKey'];
      if (organKey) {
        this.toggleOrgan(organKey);
      }
    }
  }

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Rotation douce
    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.1;
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.1;
    this.humanBody.rotation.y = this.currentRotationY;
    this.humanBody.rotation.x = this.currentRotationX;

    // Animation du cœur (pulsation)
    const pulse = Math.sin(Date.now() * 0.008) * 0.05 + 1;
    this.heartMesh.scale.set(pulse, pulse, pulse);

    // Animation des poumons (respiration)
    const breath = Math.sin(Date.now() * 0.002) * 0.03 + 1;
    this.lungsMesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.scale.y = 1.2 * breath;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  private updateHealthIndicators(): void {
    if (!this.biometricData) return;

    // Cœur
    const hr = this.biometricData.avgHeartRate || 70;
    let heartColor: number;
    if (hr < 60 || hr > 100) {
      heartColor = 0xff0000;
    } else if (hr > 90) {
      heartColor = 0xffa500;
    } else {
      heartColor = 0xff69b4;
    }
    (this.heartMesh.material as THREE.MeshPhongMaterial).color.setHex(heartColor);
    (this.heartMesh.material as THREE.MeshPhongMaterial).emissive.setHex(heartColor);

    // Poumons
    const o2 = this.biometricData.oxygenSaturation?.[0]?.percentage || 98;
    let lungColor: number;
    if (o2 < 90) {
      lungColor = 0xff0000;
    } else if (o2 < 95) {
      lungColor = 0xffa500;
    } else {
      lungColor = 0x7dd3fc;
    }
    this.lungsMesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        (mesh.material as THREE.MeshPhongMaterial).color.setHex(lungColor);
        (mesh.material as THREE.MeshPhongMaterial).emissive.setHex(lungColor);
      }
    });
  }

  // Données des organes
  organData = computed<{ [key: string]: OrganData }>(() => {
    const hr = this.biometricData?.avgHeartRate || 70;
    const o2 = this.biometricData?.oxygenSaturation?.[0]?.percentage || 98;
    const temp = this.biometricData?.bodyTemperature?.[0]?.temperature || 37;
    const steps = this.biometricData?.totalSteps || 0;

    return {
      heart: {
        name: 'Cœur',
        status: hr < 60 || hr > 100 ? 'Attention' : hr > 90 ? 'Élevé' : 'Normal',
        icon: '❤️',
        color: '#fda4af',
        statusColor: hr < 60 || hr > 100 ? '#ef4444' : hr > 90 ? '#f59e0b' : '#10b981',
        details: 'Le cœur pompe le sang dans tout le corps, fournissant oxygène et nutriments.',
        metrics: [
          { label: 'Fréquence', value: `${Math.round(hr)} bpm` },
          { label: 'État', value: hr < 60 || hr > 100 ? 'Anormal' : 'Normal' }
        ]
      },
      lungs: {
        name: 'Poumons',
        status: o2 < 90 ? 'Faible' : o2 < 95 ? 'Moyen' : 'Excellent',
        icon: '🫁',
        color: '#7dd3fc',
        statusColor: o2 < 90 ? '#ef4444' : o2 < 95 ? '#f59e0b' : '#10b981',
        details: 'Les poumons assurent les échanges gazeux essentiels à la vie.',
        metrics: [
          { label: 'SpO₂', value: `${o2}%` },
          { label: 'Capacité', value: o2 >= 95 ? 'Optimale' : 'Réduite' }
        ]
      },
      brain: {
        name: 'Cerveau',
        status: temp > 38 || temp < 36 ? 'Attention' : temp > 37.5 ? 'Élevée' : 'Normal',
        icon: '🧠',
        color: '#c4b5fd',
        statusColor: temp > 38 || temp < 36 ? '#ef4444' : temp > 37.5 ? '#f59e0b' : '#10b981',
        details: 'Le cerveau contrôle toutes les fonctions du corps et la pensée.',
        metrics: [
          { label: 'Température', value: `${temp.toFixed(1)}°C` },
          { label: 'Stress', value: `${this.biometricData?.stressScore || 20}/100` }
        ]
      },
      stomach: {
        name: 'Système digestif',
        status: 'Normal',
        icon: '🍽️',
        color: '#fde68a',
        statusColor: '#10b981',
        details: 'Le système digestif transforme les aliments en énergie.',
        metrics: [
          { label: 'Digestion', value: 'Normale' },
          { label: 'Hydratation', value: 'Bonne' }
        ]
      }
    };
  });

  toggleOrgan(key: string): void {
    this.activeOrgan.set(this.activeOrgan() === key ? null : key);
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'normal':
      case 'excellent':
      case 'bon':
        return '✅';
      case 'moyen':
      case 'élevé':
      case 'élevée':
        return '⚠️';
      case 'faible':
      case 'attention':
        return '❗';
      default:
        return 'ℹ️';
    }
  }
}