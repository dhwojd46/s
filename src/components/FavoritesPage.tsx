import { useState, useEffect, useCallback, memo } from 'react';
import { getFavorites, removeFavorite, type TempMail } from '../lib/mailData';
import { NavigationMenu, MenuButton } from './NavigationMenu';

const ICON_PATHS: Record<string, React.ReactElement> = {
  star: <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>,
  delete: <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>,
  copy: <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>,
  check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
  inbox: <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/>
};

const Icon = memo(({ name, className = "w-6 h-6" }: { name: string; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">{ICON_PATHS[name]}</svg>
));
Icon.displayName = 'Icon';

const haptic = (duration: number = 15) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  mailName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = memo(({ isOpen, mailName, onConfirm, onCancel }: DeleteConfirmModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        className="relative w-full max-w-[320px] bg-black/40 border border-white/20 rounded-[20px] overflow-hidden shadow-2xl"
        style={{
          animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          willChange: 'transform'
        }}
      >
        <div className="p-5 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-500/20 p-3 rounded-full">
              <Icon name="delete" className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[17px] font-bold text-white tracking-tight">
              确认删除
            </h3>
            <p className="text-[14px] text-white/70 leading-relaxed">
              确定要从收藏中移除<br />
              <span className="font-semibold text-white">{mailName}</span> 吗?
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { haptic(20); onCancel(); }}
              className="flex-1 py-3 rounded-[14px] bg-white/10 text-white font-semibold text-[15px] active:scale-95 transition-all touch-manipulation"
            >
              取消
            </button>
            <button
              onClick={() => { haptic(30); onConfirm(); }}
              className="flex-1 py-3 rounded-[14px] bg-gradient-to-r from-red-500/90 to-red-600/90 text-white font-semibold text-[15px] shadow-lg active:scale-95 transition-all touch-manipulation"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
DeleteConfirmModal.displayName = 'DeleteConfirmModal';

interface FavoriteCardProps {
  mail: TempMail;
  onDelete: (mail: TempMail) => void;
  onCopy: (url: string, id: string) => void;
  copiedId: string | null;
}

const FavoriteCard = memo(({ mail, onDelete, onCopy, copiedId }: FavoriteCardProps) => {
  const isCopied = copiedId === mail.id;

  return (
    <div className="bg-black/30 rounded-[20px] overflow-hidden border border-white/20 shadow-xl transition-all duration-200 hover:border-white/30">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <Icon name="star" className="w-4 h-4 text-[#FFD700] shrink-0 drop-shadow-md" />
            <h3 className="text-[17px] font-bold text-white tracking-tight drop-shadow-md truncate">
              {mail.name}
            </h3>
          </div>
          <button
            onClick={() => { haptic(30); onDelete(mail); }}
            className="shrink-0 p-2 rounded-full bg-red-500/20 active:bg-red-500/30 transition-all active:scale-95 touch-manipulation"
          >
            <Icon name="delete" className="w-5 h-5 text-red-400" />
          </button>
        </div>

        {mail.description && (
          <p className="text-[13px] text-white/80 drop-shadow-sm">
            {mail.description}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <a
            href={mail.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic(20)}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#007AFF]/90 to-[#0055b3]/90 rounded-[14px] text-white font-semibold text-[15px] text-center shadow-lg active:scale-[0.97] transition-all touch-manipulation truncate"
          >
            访问网站
          </a>
          <button
            onClick={() => { haptic(30); onCopy(mail.url, mail.id); }}
            className="shrink-0 p-2.5 bg-white/10 rounded-[14px] active:bg-white/20 transition-all active:scale-95 touch-manipulation relative overflow-hidden"
          >
            <div className={`transition-all duration-300 ${isCopied ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
              <Icon name="copy" className="w-5 h-5 text-white/80" />
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <Icon name="check" className="w-5 h-5 text-[#34C759]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
});
FavoriteCard.displayName = 'FavoriteCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<TempMail[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; mail: TempMail | null }>({
    isOpen: false,
    mail: null
  });

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleDeleteClick = useCallback((mail: TempMail) => {
    setDeleteConfirm({ isOpen: true, mail });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.mail) {
      removeFavorite(deleteConfirm.mail.id);
      setFavorites(prev => prev.filter(item => item.id !== deleteConfirm.mail!.id));
    }
    setDeleteConfirm({ isOpen: false, mail: null });
  }, [deleteConfirm.mail]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirm({ isOpen: false, mail: null });
  }, []);

  const handleCopy = useCallback(async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error('Copy failed:', error);
      haptic(50);
    }
  }, []);

  return (
    <div className="min-h-screen relative font-sans text-white pb-10 selection:bg-blue-400/30 overflow-x-hidden">
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 h-[52px] z-40 flex items-center justify-between px-4 pt-2 transition-all duration-300">
          <h1 className="text-[17px] font-semibold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            我的收藏
          </h1>
          <MenuButton onClick={() => { haptic(20); setShowMenu(true); }} />
        </header>

        <main className="max-w-[420px] mx-auto px-5 pt-20 pb-10">
          {favorites.length > 0 ? (
            <div className="space-y-3">
              {favorites.map((mail) => (
                <FavoriteCard
                  key={mail.id}
                  mail={mail}
                  onDelete={handleDeleteClick}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-black/30 px-8 py-8 rounded-[20px] border border-white/20 shadow-xl text-center space-y-4">
                <div className="flex justify-center">
                  <Icon name="inbox" className="w-12 h-12 text-white/60" />
                </div>
                <div className="space-y-2">
                  <p className="text-[17px] font-semibold text-white drop-shadow-md">
                    暂无收藏
                  </p>
                  <p className="text-[14px] text-white/70 drop-shadow-sm">
                    在临时邮箱页面点击星标添加收藏
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <NavigationMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        mailName={deleteConfirm.mail?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}