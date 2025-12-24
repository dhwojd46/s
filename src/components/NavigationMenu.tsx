import { useState, useEffect, memo } from 'react';

const ICON_PATHS: Record<string, React.ReactElement> = {
  menu: <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>,
  close: <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>,
  home: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>,
  mail: <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>,
  star: <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
};

const Icon = memo(({ name, className = "w-6 h-6" }: { name: string; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">{ICON_PATHS[name]}</svg>
));
Icon.displayName = 'Icon';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationMenu = memo(({ isOpen, onClose }: NavigationMenuProps) => {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems = [
    { href: '/', label: '脸书小助手', icon: 'home' },
    { href: '/mail', label: '临时邮箱', icon: 'mail' },
    { href: '/mail/favorites', label: '我的收藏', icon: 'star' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-[280px] h-full bg-black/40 border-l border-white/20 shadow-2xl overflow-hidden flex flex-col"
        style={{
          animation: 'slideInRight 0.3s ease-out',
          willChange: 'transform'
        }}
      >
        <div className="p-4 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between shrink-0">
          <h3 className="text-[17px] font-semibold text-white tracking-tight drop-shadow-md">
            导航菜单
          </h3>
          <button
            onClick={onClose}
            className="bg-white/10 p-1.5 rounded-full text-white/60 hover:bg-white/20 active:scale-95 transition-all touch-manipulation"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2" style={{ WebkitOverflowScrolling: 'touch' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] touch-manipulation border ${
                  isActive
                    ? 'bg-white/10 border-white/10 shadow-lg text-[#409CFF] font-semibold'
                    : 'bg-transparent border-transparent text-white/80 active:bg-white/10'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#007AFF]/20' : 'bg-white/10'}`}>
                  <Icon name={item.icon} className={`w-4 h-4 ${isActive ? 'text-[#409CFF]' : 'text-white/50'}`} />
                </div>
                <span className="text-[16px] tracking-tight drop-shadow-sm">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
});
NavigationMenu.displayName = 'NavigationMenu';

export const MenuButton = memo(({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="p-1.5 rounded-full bg-black/40 border border-white/20 shadow-lg transition-all duration-200 active:scale-95 touch-manipulation hover:bg-black/50"
  >
    <Icon name="menu" className="w-5 h-5 text-white drop-shadow-md" />
  </button>
));
MenuButton.displayName = 'MenuButton';
