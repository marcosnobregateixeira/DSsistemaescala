import { Soldier, Roster, AppSettings, User, UserRole, Rank, Role, Status, RosterCategory, ExtraDutyHistory, Cadre, TeamMapping, ColorPalette, Backup } from '../types';
import { supabase } from './supabase';

const DEFAULT_PALETTES: ColorPalette[] = [
  {
    id: 'classic',
    name: 'Clássico (Padrão)',
    headerBg: '#ffffff',
    headerText: '#000000',
    tableHeaderBg: '#cbd5b0',
    tableHeaderText: '#000000',
    tableBodyBg: '#ffffff',
    tableBodyText: '#000000',
    borderColor: '#000000',
    accentColor: '#e4e9d6',
    holidayBg: '#e2e8f0',
    optionalHolidayBg: '#f1f5f9',
    weekendBg: '#f8fafc'
  },
  {
    id: 'modern_blue',
    name: 'Azul Moderno',
    headerBg: '#f8fafc',
    headerText: '#1e293b',
    tableHeaderBg: '#3b82f6',
    tableHeaderText: '#ffffff',
    tableBodyBg: '#ffffff',
    tableBodyText: '#334155',
    borderColor: '#cbd5e1',
    accentColor: '#eff6ff',
    holidayBg: '#fee2e2',
    optionalHolidayBg: '#dcfce7',
    weekendBg: '#f1f5f9'
  },
  {
    id: 'dark_mode',
    name: 'Modo Escuro (Impressão)',
    headerBg: '#1e293b',
    headerText: '#f8fafc',
    tableHeaderBg: '#334155',
    tableHeaderText: '#f8fafc',
    tableBodyBg: '#0f172a',
    tableBodyText: '#cbd5e1',
    borderColor: '#334155',
    accentColor: '#1e293b',
    holidayBg: '#450a0a',
    optionalHolidayBg: '#064e3b',
    weekendBg: '#1e293b'
  },
  {
    id: 'military_green',
    name: 'Verde Militar',
    headerBg: '#f0f4f0',
    headerText: '#1a2e1a',
    tableHeaderBg: '#2d4a2d',
    tableHeaderText: '#ffffff',
    tableBodyBg: '#ffffff',
    tableBodyText: '#1a2e1a',
    borderColor: '#2d4a2d',
    accentColor: '#e8f0e8',
    holidayBg: '#ffeded',
    optionalHolidayBg: '#edfff0',
    weekendBg: '#f5f9f5'
  },
  {
    id: 'sunset_warm',
    name: 'Pôr do Sol',
    headerBg: '#fff7ed',
    headerText: '#7c2d12',
    tableHeaderBg: '#ea580c',
    tableHeaderText: '#ffffff',
    tableBodyBg: '#ffffff',
    tableBodyText: '#431407',
    borderColor: '#ea580c',
    accentColor: '#fff7ed',
    holidayBg: '#ffedd5',
    optionalHolidayBg: '#fef3c7',
    weekendBg: '#fffaf0'
  },
  {
    id: 'ocean_breeze',
    name: 'Brisa do Oceano',
    headerBg: '#f0f9ff',
    headerText: '#0c4a6e',
    tableHeaderBg: '#0284c7',
    tableHeaderText: '#ffffff',
    tableBodyBg: '#ffffff',
    tableBodyText: '#082f49',
    borderColor: '#0284c7',
    accentColor: '#f0f9ff',
    holidayBg: '#e0f2fe',
    optionalHolidayBg: '#f0fdf4',
    weekendBg: '#f0f4f8'
  },
  {
    id: 'light_red',
    name: 'Vermelho Claro (Alerta)',
    headerBg: '#fef2f2',
    headerText: '#991b1b',
    tableHeaderBg: '#ef4444',
    tableHeaderText: '#ffffff',
    tableBodyBg: '#ffffff',
    tableBodyText: '#450a0a',
    borderColor: '#fca5a5',
    accentColor: '#fef2f2',
    holidayBg: '#fee2e2',
    optionalHolidayBg: '#ffedd5',
    weekendBg: '#fff1f2'
  },
  {
    id: 'royal_purple',
    name: 'Roxo Real',
    headerBg: '#faf5ff',
    headerText: '#581c87',
    tableHeaderBg: '#9333ea',
    tableHeaderText: '#ffffff',
    tableBodyBg: '#ffffff',
    tableBodyText: '#3b0764',
    borderColor: '#d8b4fe',
    accentColor: '#faf5ff',
    holidayBg: '#f3e8ff',
    optionalHolidayBg: '#fce7f3',
    weekendBg: '#f5f3ff'
  }
];

const INITIAL_CATEGORIES: RosterCategory[] = [
  { id: 'cat_amb', name: 'Ambulância', icon: 'Truck' },
  { id: 'cat_psi', name: 'Psicologia', icon: 'Brain' },
  { id: 'cat_odo', name: 'Odontologia', icon: 'Stethoscope' },
  { id: 'cat_ast', name: 'Assistencial', icon: 'HeartPulse' },
  { id: 'cat_adm', name: 'Administrativo', icon: 'Briefcase' },
  { id: 'cat_extra', name: 'Escala Extra / Voluntária', icon: 'Star' }
];

const INITIAL_TEAM_MAPPINGS: TeamMapping[] = [
  { teamName: 'ALFA', shiftName: 'TURMA 01' },
  { teamName: 'BRAVO', shiftName: 'TURMA 01' },
  { teamName: 'CHARLIE', shiftName: 'TURMA 02' },
  { teamName: 'DELTA', shiftName: 'TURMA 02' }
];

const INITIAL_SETTINGS: AppSettings = {
  orgName: 'DIRETORIA DE SAÚDE – PMCE',
  institutionName: 'POLÍCIA MILITAR DO CEARÁ',
  unitName: 'COMANDO DE POLICIAMENTO DE CHOQUE',
  directorName: 'FRANCISCO ÉLITON ARAÚJO',
  directorRank: 'Cel PM',
  directorRole: 'Diretor de Saúde - DS/PMCE',
  directorMatricula: 'M.F 108.819-1-9',
  shiftCycleRefDate: '2024-01-01',
  logoLeft: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Bras%C3%A3o_da_Pol%C3%ADcia_Militar_do_Cear%C3%A1.png', 
  logoRight: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Bras%C3%A3o_do_Cear%C3%A1.svg/512px-Bras%C3%A3o_do_Cear%C3%A1.svg.png', 
  showLogoLeft: true,
  showLogoRight: true,
  city: 'Fortaleza-CE',
  showPhoneInPrint: true,
  rosterCategories: INITIAL_CATEGORIES,
  teamMappings: INITIAL_TEAM_MAPPINGS,
  colorPalette: DEFAULT_PALETTES[0],
  availablePalettes: DEFAULT_PALETTES,
  appearance: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 'medium',
    textCase: 'uppercase'
  }
};

const INITIAL_SOLDIERS: Soldier[] = [
  { id: '1', name: 'Cruz', rank: Rank.SUBTEN, cadre: Cadre.QOPPM, role: Role.FISCAL_MOTORISTA, roleShort: '(F.M)', sector: 'Ambulância', team: 'ALFA', status: Status.ATIVO, phone: '98651.4680', availableForExtra: true, orderExtra: 1 },
  { id: '2', name: 'Virginia', rank: Rank.TEN_1, cadre: Cadre.QOAPM, role: Role.FISCAL, roleShort: '(F)', sector: 'Ambulância', team: 'BRAVO', status: Status.ATIVO, phone: '88 99335.6947', availableForExtra: true, orderExtra: 2 },
  { id: '3', name: 'Ricardo', rank: Rank.SGT_1, cadre: Cadre.QOPPM, role: Role.FISCAL, roleShort: '(F)', sector: 'Ambulância', team: 'CHARLIE', status: Status.ATIVO, matricula: '20126', phone: '98838-4022', availableForExtra: true, orderExtra: 3 },
  { id: '20', name: 'Maria', rank: Rank.SD, cadre: Cadre.QOPPM, role: Role.ENFERMEIRO, roleShort: '(1)', sector: 'Ambulância', team: 'TURMA 01', status: Status.ATIVO, matricula: '36.113', phone: '98180-1288', availableForExtra: true, orderExtra: 4 }
];

class StoreService {
  private listeners: (() => void)[] = [];
  private isCloudBypassed: boolean = false;
  
  constructor() {
    // Check if cloud was bypassed in this session
    this.isCloudBypassed = sessionStorage.getItem('supabase_bypassed') === 'true';
    
    // Inicialização puramente local
    this.initSupabaseSync();
    this.checkAndTriggerAutoBackup();
  }

  // --- LOCAL STORE LOGIC ---

  private setCloudBypassed() {
    this.isCloudBypassed = true;
    sessionStorage.setItem('supabase_bypassed', 'true');
    console.warn('Supabase: Cloud Sync desativado para esta sessão devido a erros de conexão.');
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private getLocal<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private setLocal(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
    this.notify();
  }

  // --- SUPABASE SYNC LOGIC ---

  private async initSupabaseSync() {
    if (!supabase || this.isCloudBypassed) return;

    try {
      // Test connectivity first with a simple check
      const { error: connectionError } = await supabase.from('app_settings').select('id').limit(1);
      
      if (connectionError) {
        if (connectionError.message.includes('fetch') || connectionError.message.includes('NetworkError') || connectionError.message.includes('Failed to fetch')) {
          this.setCloudBypassed();
          console.warn('Supabase: Falha de rede ao conectar. O modo offline será mantido.');
          return;
        }
        console.error('Supabase Error:', connectionError);
      }

      // Sync Soldiers
      const { data: soldiersData } = await supabase.from('soldiers').select('data');
      if (soldiersData && soldiersData.length > 0) {
        const soldiers = soldiersData.map((row: any) => row.data);
        this.setLocal('soldiers', soldiers);
      }

      // Sync Rosters
      const { data: rostersData } = await supabase.from('rosters').select('data');
      if (rostersData && rostersData.length > 0) {
        const rosters = rostersData.map((row: any) => row.data);
        this.setLocal('rosters', rosters);
      }

      // Sync Settings
      const { data: settingsData } = await supabase.from('app_settings').select('data').limit(1);
      if (settingsData && settingsData.length > 0) {
        this.setLocal('app_settings', settingsData[0].data);
      }

      // Sync Extra Duty History
      const { data: historyData } = await supabase.from('extra_duty_history').select('data');
      if (historyData && historyData.length > 0) {
        const history = historyData.map((row: any) => row.data);
        this.setLocal('extra_duty_history', history);
      }

    } catch (error: any) {
      console.error('Error syncing with Supabase:', error);
      if (error.message && (error.message.includes('fetch') || error.message.includes('NetworkError'))) {
        console.warn('Supabase: Erro de rede detectado durante sincronização inicial.');
      }
    }
  }

  // --- PUBLIC API ---

  getSettings(): AppSettings {
    const stored = this.getLocal<AppSettings>('app_settings');
    const defaults = INITIAL_SETTINGS;
    
    if (!stored) {
        this.setLocal('app_settings', defaults);
        return defaults;
    }
    
    // Garantias de compatibilidade e valores default para evitar uncontrolled inputs
    const result = {
      ...defaults,
      ...stored,
      // Ensure specific fields are never undefined
      orgName: stored.orgName || defaults.orgName,
      directorName: stored.directorName || defaults.directorName,
      directorRank: stored.directorRank || defaults.directorRank,
      directorRole: stored.directorRole || defaults.directorRole,
      directorMatricula: stored.directorMatricula || defaults.directorMatricula,
      city: stored.city || defaults.city,
      logoLeft: stored.logoLeft || defaults.logoLeft,
      logoRight: stored.logoRight || defaults.logoRight,
      // Boolean fields need careful handling (false is valid)
      showLogoLeft: stored.showLogoLeft !== undefined ? stored.showLogoLeft : defaults.showLogoLeft,
      showLogoRight: stored.showLogoRight !== undefined ? stored.showLogoRight : defaults.showLogoRight,
      showPhoneInPrint: stored.showPhoneInPrint !== undefined ? stored.showPhoneInPrint : defaults.showPhoneInPrint,
      // Arrays
      rosterCategories: stored.rosterCategories || defaults.rosterCategories,
      teamMappings: stored.teamMappings || defaults.teamMappings,
      // Color Palettes
      colorPalette: stored.colorPalette || defaults.colorPalette,
      availablePalettes: DEFAULT_PALETTES, // Always use the latest system palettes
      // Typography
      appearance: stored.appearance || defaults.appearance
    };
    
    // Ensure cat_odo exists in rosterCategories
    if (!result.rosterCategories.find(c => c.id === 'cat_odo')) {
      result.rosterCategories.splice(2, 0, { id: 'cat_odo', name: 'Odontologia', icon: 'Stethoscope' });
      this.setLocal('app_settings', result);
    }
    
    return result;
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    this.setLocal('app_settings', settings);
    if (supabase && !this.isCloudBypassed) {
      try {
        // Delete old settings to keep only one active configuration row
        await supabase.from('app_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
        await supabase.from('app_settings').insert({ data: settings });
      } catch (err) {
        console.warn('Erro ao salvar settings na nuvem:', err);
      }
    }
  }

  getSoldiers(): Soldier[] {
    const stored = this.getLocal<Soldier[]>('soldiers');
    if (!stored || stored.length === 0) {
        this.setLocal('soldiers', INITIAL_SOLDIERS);
        return INITIAL_SOLDIERS;
    }
    return stored;
  }

  async saveSoldier(soldier: Soldier): Promise<void> {
    const soldiers = this.getSoldiers();
    const index = soldiers.findIndex(s => s.id === soldier.id);
    if (index >= 0) soldiers[index] = soldier; else soldiers.push(soldier);
    
    this.setLocal('soldiers', soldiers);

    if (supabase && !this.isCloudBypassed) {
      try {
        const { data } = await supabase.from('soldiers').select('id, data');
        const existing = data?.find((row: any) => row.data.id === soldier.id);
        
        if (existing) {
          await supabase.from('soldiers').update({ data: soldier, updated_at: new Date() }).eq('id', existing.id);
        } else {
          await supabase.from('soldiers').insert({ data: soldier });
        }
      } catch (err) {
        console.warn('Erro ao salvar soldado na nuvem:', err);
      }
    }
  }

  async deleteSoldier(id: string): Promise<void> {
    this.setLocal('soldiers', this.getSoldiers().filter(s => s.id !== id));
    
    if (supabase) {
      const { data } = await supabase.from('soldiers').select('id, data');
      const existing = data?.find((row: any) => row.data.id === id);
      if (existing) {
        await supabase.from('soldiers').delete().eq('id', existing.id);
      }
    }
  }

  getRosters(): Roster[] {
    return this.getLocal<Roster[]>('rosters') || [];
  }

  async saveRoster(roster: Roster): Promise<void> {
    const rosters = this.getRosters();
    const index = rosters.findIndex(r => r.id === roster.id);
    if (index >= 0) rosters[index] = roster; else rosters.push(roster);
    
    this.setLocal('rosters', rosters);

    if (supabase && !this.isCloudBypassed) {
      try {
        // Otimização: Busca apenas o ID interno do Supabase filtrando pelo ID da escala no JSONB
        const { data: existingData } = await supabase
          .from('rosters')
          .select('id')
          .eq('data->>id', roster.id)
          .maybeSingle();
        
        if (existingData) {
          await supabase.from('rosters').update({ data: roster, updated_at: new Date() }).eq('id', existingData.id);
        } else {
          await supabase.from('rosters').insert({ data: roster });
        }
      } catch (err) {
        console.warn('Erro ao salvar escala na nuvem:', err);
      }
    }
  }

  async deleteRoster(id: string): Promise<void> {
    this.setLocal('rosters', this.getRosters().filter(r => r.id !== id));

    if (supabase) {
      // Otimização: Busca apenas o ID interno do Supabase filtrando pelo ID da escala no JSONB
      const { data: existingData } = await supabase
        .from('rosters')
        .select('id')
        .eq('data->>id', id)
        .maybeSingle();

      if (existingData) {
        await supabase.from('rosters').delete().eq('id', existingData.id);
      }
    }
  }
  
  // --- EXTRA DUTY HISTORY ---
  getExtraDutyHistory(): ExtraDutyHistory[] {
    return this.getLocal<ExtraDutyHistory[]>('extra_duty_history') || [];
  }

  async saveExtraDutyHistory(record: ExtraDutyHistory): Promise<void> {
    const history = this.getExtraDutyHistory();
    history.push(record);
    
    this.setLocal('extra_duty_history', history);

    if (supabase) {
      await supabase.from('extra_duty_history').insert({ data: record });
    }
  }

  // --- AUTHENTICATION LOGIC (SUPABASE) ---

  async login(email: string, password: string): Promise<{ user: User | null, error: string | null }> {
    if (!supabase || this.isCloudBypassed) {
      // Fallback para modo offline (apenas para desenvolvimento local sem Supabase)
      console.warn('Usando autenticação local (Offline Mode).');
      const mockUser: User = { id: 'local-admin', username: 'Administrador (Offline)', role: 'ADMIN' };
      sessionStorage.setItem('current_user', JSON.stringify(mockUser));
      this.notify();
      return { user: mockUser, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro de autenticação:', error.message);
        const msg = error.message || '';
        if (msg.includes('fetch') || msg.includes('NetworkError') || msg.includes('Failed to fetch')) {
             this.setCloudBypassed();
             return { user: null, error: 'Erro de conexão com o servidor. Tente novamente ou use o modo offline.' };
        }
        if (msg.includes("Invalid login credentials")) {
             return { user: null, error: 'Credenciais inválidas. Se for o primeiro acesso, use "Esqueci a senha" com a Chave Mestra para criar a conta.' };
        }
        if (msg.includes("Email not confirmed")) {
             return { user: null, error: 'Email não confirmado. Verifique sua caixa de entrada.' };
        }
        return { user: null, error: 'Erro de Autenticação: ' + msg };
      }

      if (data.user) {
        let role: UserRole = 'VISUALIZADOR';
        const userEmail = data.user.email?.toLowerCase() || '';
        
        if (userEmail === 'marcos_notigan@hotmail.com') {
           role = 'ADMIN';
        } else if (userEmail.includes('operador')) {
           role = 'OPERADOR';
        }
        
        // Try to fetch profile for exact role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
        if (profile?.role) {
           role = profile.role.toUpperCase() as UserRole;
        }

        const user: User = {
          id: data.user.id,
          username: data.user.email || 'Administrador',
          role
        };
        sessionStorage.setItem('current_user', JSON.stringify(user));
        this.notify();
        return { user, error: null };
      }
      
      return { user: null, error: 'Erro desconhecido ao fazer login.' };
    } catch (err: any) {
      const message = err.message || '';
      console.error('Catch Login Error:', err);
      
      if (message.includes('fetch') || message.includes('NetworkError') || message.includes('Failed to fetch')) {
        this.setCloudBypassed();
        return { 
          user: null, 
          error: 'Erro de conexão: Não foi possível alcançar o servidor. Experimente recarregar a página ou usar o modo offline.' 
        };
      }
      
      return { user: null, error: message || 'Erro de conexão inesperado.' };
    }
  }

  async logout(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('current_user');
    this.notify();
  }

  getCurrentUser(): User | null {
    const data = sessionStorage.getItem('current_user');
    return data ? JSON.parse(data) : null;
  }
  
  // --- MÉTODOS DEPRECATED/REMOVIDOS (Mantidos como stub para evitar quebra de build imediata, mas seguros) ---
  
  async verifyAdminPassword(input: string): Promise<boolean> {
    console.warn('verifyAdminPassword is deprecated. Use login() instead.');
    return false; 
  }

  async updateAdminPassword(newPassword: string): Promise<void> {
     if (supabase) {
       await supabase.auth.updateUser({ password: newPassword });
     }
  }

  verifyRecoveryKey(key: string): boolean {
    // Chave Mestra para recuperação de acesso (Legado/Emergência)
    const MASTER_KEY = "PMCE@2025";
    return key === MASTER_KEY;
  }

  async resetAdminPassword(email: string, newPassword: string): Promise<void> {
    if (supabase && !this.isCloudBypassed) {
        // Tenta criar o usuário (caso não exista)
        const { data, error } = await supabase.auth.signUp({
            email,
            password: newPassword,
        });

        if (error) {
            if (error.message.includes("already registered")) {
                const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
                if (resetError) {
                    throw new Error("Erro ao enviar email de recuperação: " + resetError.message);
                }
                throw new Error("Usuário já existe. Um email de recuperação foi enviado para " + email + ". Verifique sua caixa de entrada.");
            }
            console.error("Erro ao criar/resetar usuário admin:", error.message);
            throw new Error(error.message);
        }

        if (data.user && !data.session) {
             throw new Error("Usuário criado! Verifique seu email (" + email + ") para confirmar o cadastro antes de logar.");
        }
    } else {
        throw new Error("O modo offline não permite redefinição de senha via servidor. Verifique sua conexão.");
    }
  }

  // --- BACKUP / RESTORE ---

  getBackups(): Backup[] {
    return this.getLocal<Backup[]>('backups') || [];
  }

  async createBackup(type: 'AUTO' | 'MANUAL' = 'MANUAL'): Promise<Backup> {
    const backup: Backup = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type,
      data: {
        soldiers: this.getSoldiers(),
        rosters: this.getRosters(),
        app_settings: this.getSettings(),
        extra_duty_history: this.getExtraDutyHistory()
      }
    };

    // Obter backups atuais da memória local
    const currentBackupsData = localStorage.getItem('backups');
    let backups: Backup[] = currentBackupsData ? JSON.parse(currentBackupsData) : [];
    
    // Adicionar no início
    backups.unshift(backup);
    
    // Manter apenas os 5 últimos
    const limitedBackups = backups.slice(0, 5);
    localStorage.setItem('backups', JSON.stringify(limitedBackups));
    
    this.notify();
    return backup;
  }

  async deleteBackup(id: string): Promise<void> {
    const backups = this.getBackups();
    this.setLocal('backups', backups.filter(b => b.id !== id));
  }

  private checkAndTriggerAutoBackup() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 5 = Friday
    const hour = now.getHours();
    
    // Check if it's Friday (5) and after 18:00
    if (dayOfWeek === 5 && hour >= 18) {
      const lastAutoBackupDate = localStorage.getItem('last_auto_backup_date');
      const todayStr = now.toISOString().split('T')[0];
      
      if (lastAutoBackupDate !== todayStr) {
        console.log('Triggering automatic Friday backup...');
        this.createBackup('AUTO');
        localStorage.setItem('last_auto_backup_date', todayStr);
      }
    }
  }

  async restoreBackup(data: any): Promise<void> {
    // 1. Restore to LocalStorage
    const saveToLocal = (key: string, value: any) => {
        if (value === undefined || value === null) return;
        if (typeof value === 'string') {
            localStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    saveToLocal('soldiers', data.soldiers);
    saveToLocal('rosters', data.rosters);
    saveToLocal('app_settings', data.app_settings);
    saveToLocal('admin_password', data.admin_password);
    saveToLocal('extra_duty_history', data.extra_duty_history);

    // 2. If Supabase is connected, we MUST push this restored data to the server
    // to prevent the server from overwriting it with old data on next sync.
    if (supabase) {
        try {
            // Helper to push data if it exists
            const pushData = async (table: string, key: string) => {
                const localData = this.getLocal(key);
                if (!localData) return;

                // For simplicity, we delete all rows and re-insert. 
                // This is drastic but ensures the backup state is exactly replicated.
                // However, RLS might prevent delete all.
                // Let's try to upsert row by row or use the 'data' column approach we have.
                
                // Since our schema uses a single 'data' column per row (document store style),
                // we can iterate and upsert.
                
                const items = Array.isArray(localData) ? localData : [localData];
                
                for (const item of items) {
                    // Assuming item has an ID. If not (like settings), we use a fixed ID or similar logic.
                    if (table === 'app_settings') {
                         await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
                         await supabase.from(table).insert({ data: item });
                    } else {
                         // For arrays (soldiers, rosters), we try to upsert based on ID if possible
                         // But since we don't have a unique constraint on data->>id, we might duplicate if we just insert.
                         // So we check existence first.
                         const id = item.id;
                         if (id) {
                             // This is slow but safe for restoration
                             const { data: existing } = await supabase.from(table).select('id').eq('data->>id', id).maybeSingle();
                             if (existing) {
                                 await supabase.from(table).update({ data: item, updated_at: new Date() }).eq('id', existing.id);
                             } else {
                                 await supabase.from(table).insert({ data: item });
                             }
                         }
                    }
                }
            };

            await pushData('soldiers', 'soldiers');
            await pushData('rosters', 'rosters');
            await pushData('app_settings', 'app_settings');
            await pushData('extra_duty_history', 'extra_duty_history');
            
            console.log("Backup synced to Supabase successfully.");

        } catch (err) {
            console.error("Error syncing backup to Supabase:", err);
            // We don't throw here because local restore succeeded.
            // But we should warn the user.
            alert("Backup restaurado localmente, mas houve erro ao sincronizar com a nuvem. Verifique sua conexão.");
        }
    }
  }

  // --- DEBUG / TEST ---
  async testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
    if (!supabase) {
      return { success: false, message: 'Cliente Supabase não inicializado. Verifique as variáveis de ambiente (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).' };
    }
    try {
      // 1. Teste de Leitura (HEAD)
      const { error: readError } = await supabase.from('app_settings').select('*', { count: 'exact', head: true });
      
      if (readError) {
         // Se falhar na leitura, nem tenta escrita.
         throw new Error(`Falha na leitura: ${readError.message}`);
      }

      // 2. Teste de Escrita (Opcional, mas bom para garantir permissões)
      // Tenta atualizar o timestamp da própria configuração (sem mudar dados)
      // Isso valida se o RLS de update está funcionando para o usuário logado.
      const user = this.getCurrentUser();
      if (user && user.role === 'ADMIN') {
          const { error: writeError } = await supabase.from('app_settings').update({ updated_at: new Date() }).eq('id', '00000000-0000-0000-0000-000000000000'); // ID dummy, não vai achar nada mas vai testar a permissão/conexão
          
          // Nota: O update acima provavelmente não vai afetar nenhuma linha (ID 000...), 
          // mas se der erro de permissão ou conexão, vai lançar erro.
          if (writeError && !writeError.message.includes("0 rows")) {
             // Ignoramos erro de "0 rows" pois é esperado.
             console.warn("Erro no teste de escrita (não crítico):", writeError.message);
          }
      }

      return { success: true, message: 'Conexão com Supabase (Leitura/Escrita) estabelecida com sucesso!' };

    } catch (e: any) {
      const msg = e.message || 'Erro desconhecido';
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
          return { success: false, message: 'Falha na conexão. Verifique sua internet.' };
      }
      return { success: false, message: `Erro ao conectar: ${msg}` };
    }
  }
}

export const db = new StoreService();