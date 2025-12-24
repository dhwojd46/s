export interface TempMail {
  id: string;
  name: string;
  url: string;
  description?: string;
}

export const tempMailList: TempMail[] = [
  { id: '1', name: 'Fake Mail Generator', url: 'https://www.fakemailgenerator.com/', description: '批量生成' },
  { id: '2', name: '10 Minute Mail', url: 'https://10minutemail.com/', description: '10分钟有效期' },
  { id: '3', name: 'Guerrilla Mail', url: 'https://www.guerrillamail.com/', description: '简单快速' },
  { id: '4', name: 'Temp Mail', url: 'https://temp-mail.org/', description: '自动刷新收件箱' },
  { id: '5', name: 'Mohmal', url: 'https://www.mohmal.com/zh', description: '支持阿拉伯语' },
  { id: '6', name: 'TempMail.plus', url: 'https://tempmail.plus/', description: '现代化界面' },
  { id: '7', name: 'Maildrop', url: 'https://maildrop.cc/', description: '无需注册' },
];

export function getFavorites(): TempMail[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('mail_favorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: TempMail[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('mail_favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
}

export function isFavorite(id: string): boolean {
  const favorites = getFavorites();
  return favorites.some(item => item.id === id);
}

export function toggleFavorite(mail: TempMail): boolean {
  const favorites = getFavorites();
  const index = favorites.findIndex(item => item.id === mail.id);
  
  if (index > -1) {
    favorites.splice(index, 1);
    saveFavorites(favorites);
    return false;
  } else {
    favorites.push(mail);
    saveFavorites(favorites);
    return true;
  }
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites();
  const filtered = favorites.filter(item => item.id !== id);
  saveFavorites(filtered);
}