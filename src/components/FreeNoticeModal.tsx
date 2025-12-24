'use client';

import { useState, useEffect, useCallback, memo } from 'react';

// 图标组件
const ICON_PATHS: Record<string, React.ReactElement> = {
  sparkles: <path d="M7 11v2l-4 1 4 1v2l1-4-1-4zm5-7v4l-3 1 3 1v4l2-5-2-5zm5.66 2.94L15 6.26l.66-2.94L18.34 6l2.66.68-2.66.68-.68 2.58-.66-2.94zM15 18l-2-3 2-3 2 3-2 3z"/>,
  heart: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>,
  gift: <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>,
  check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
};

const Icon = memo(({ name, className = "w-6 h-6" }: { name: string; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">{ICON_PATHS[name]}</svg>
));
Icon.displayName = 'Icon';

// 触摸反馈
const haptic = (duration: number = 15) => { 
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { 
    navigator.vibrate(duration);
  } 
};

// Cookie 操作函数
const setCookie = (name: string, value: string, days: number = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// 免费提示弹窗组件
export const FreeNoticeModal = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkNoticeStatus = () => {
      const shown = getCookie('freeNoticeShown');
      if (shown !== 'true') {
        setIsOpen(true);
      }
      setIsLoading(false);
    };
    checkNoticeStatus();
  }, []);

  const handleClose = useCallback(() => {
    haptic(20);
    setIsOpen(false);
  }, []);

  const handleDontShowAgain = useCallback(() => {
    haptic(30);
    setIsOpen(false);
    setCookie('freeNoticeShown', 'true', 365);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { 
        document.body.style.overflow = ''; 
      };
    }
  }, [isOpen]);

  if (isLoading || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/20 transition-opacity duration-300"
        style={{
          animation: 'fadeIn 0.3s ease-out'
        }}
      />
      
      <div 
        className="relative w-full max-w-[360px] sm:max-w-sm bg-black/10 backdrop-blur-[6px] border border-white/30 rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col"
        style={{ 
          animation: 'powerZoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          willChange: 'auto'
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 sm:w-48 h-40 sm:h-48 bg-gradient-to-b from-[#007AFF]/15 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-28 sm:w-32 h-28 sm:h-32 bg-gradient-to-tl from-[#34C759]/15 to-transparent rounded-full blur-2xl" />
        </div>

        <div className="relative p-4 sm:p-5 md:p-8 pt-6 sm:pt-8 md:pt-10 space-y-4 sm:space-y-5 md:space-y-6 overflow-y-auto flex-1">
          <div className="flex justify-center">
            <img 
              src="/favicon.ico" 
              alt="logo" 
              className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 drop-shadow-2xl"
            />
          </div>

          <div className="text-center space-y-1.5 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
              欢迎使用
            </h2>
            <p className="text-white/70 text-sm sm:text-[15px] md:text-[16px]">
              无广告 • 无限制
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-3 bg-white/5 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-5 border border-white/10">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="bg-[#34C759]/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 mt-0.5">
                <Icon name="check" className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#34C759]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm sm:text-[15px] md:text-[16px] mb-0.5 sm:mb-1">
                  无广告干扰
                </h3>
                <p className="text-white/60 text-xs sm:text-[13px] md:text-[14px] leading-relaxed">
                  纯净体验,专注使用
                </p>
              </div>
            </div>
            
            <div className="h-[0.5px] bg-white/10" />
            
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="bg-[#007AFF]/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0 mt-0.5">
                <Icon name="gift" className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#007AFF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm sm:text-[15px] md:text-[16px] mb-0.5 sm:mb-1">
                  无使用限制
                </h3>
                <p className="text-white/60 text-xs sm:text-[13px] md:text-[14px] leading-relaxed">
                  随心使用,畅享所有功能
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-2.5 md:space-y-3 pb-safe">
            <button
              onClick={handleClose}
              className="w-full py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-[#007AFF] to-[#0055b3] rounded-[14px] sm:rounded-[16px] text-white font-semibold text-[15px] sm:text-[16px] md:text-[17px] shadow-lg active:scale-[0.97] transition-all touch-manipulation"
            >
              开始使用
            </button>
            
            <a
              href="https://t.me/fang180"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptic(20)}
              className="block w-full py-2.5 sm:py-3 text-white/60 hover:text-white/80 text-[13px] sm:text-[14px] md:text-[15px] font-medium transition-colors active:scale-95 touch-manipulation text-center"
            >
              加入交流群 @fang180
            </a>
            
            <button
              onClick={handleDontShowAgain}
              className="w-full py-2.5 sm:py-3 text-white/60 hover:text-white/80 text-[13px] sm:text-[14px] md:text-[15px] font-medium transition-colors active:scale-95 touch-manipulation"
            >
              不再提示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
FreeNoticeModal.displayName = 'FreeNoticeModal';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center">
      <FreeNoticeModal />
    </div>
  );
}