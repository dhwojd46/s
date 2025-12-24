import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

interface BackgroundContextType {
  backgroundUrl: string;
  isLoaded: boolean;
  setLoaded: () => void;
  refreshBackground: () => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const BG_CACHE_KEY = 'app_background_cache';
const BG_SESSION_KEY = 'app_background_session';
const BG_GLOBAL_KEY = 'app_background_global';
const BG_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 24小时过期
const BG_LOAD_TIMEOUT = 10000; // 10秒加载超时

interface BackgroundCache {
  url: string;
  timestamp: number;
}

let globalBackgroundUrl: string | null = null;

function getGlobalBackground(): string | null {
  return globalBackgroundUrl;
}

function setGlobalBackground(url: string): void {
  globalBackgroundUrl = url;
}

function getSessionBackground(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return sessionStorage.getItem(BG_SESSION_KEY);
  } catch {
    return null;
  }
}

function setSessionBackground(url: string): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(BG_SESSION_KEY, url);
  } catch (error) {
    console.error('Failed to set session background:', error);
  }
}

function getCachedBackground(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(BG_CACHE_KEY);
    if (!cached) return null;

    const data: BackgroundCache = JSON.parse(cached);
    const now = Date.now();

    if (now - data.timestamp > BG_EXPIRE_TIME) {
      localStorage.removeItem(BG_CACHE_KEY);
      return null;
    }

    return data.url;
  } catch {
    return null;
  }
}

function setCachedBackground(url: string): void {
  if (typeof window === 'undefined') return;

  try {
    const data: BackgroundCache = {
      url,
      timestamp: Date.now()
    };
    localStorage.setItem(BG_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to cache background:', error);
  }
}

function fetchNewBackground(): string {
  return `https://loliapi.com/acg/?${Date.now()}`;
}

// 预加载图片并验证
async function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      img.src = '';
      resolve(false);
    }, BG_LOAD_TIMEOUT);

    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };

    img.src = url;
  });
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initBackground = async () => {
      // 第一优先级：检查全局变量（其他组件实例已加载过）
      const globalUrl = getGlobalBackground();
      if (globalUrl) {
        setBackgroundUrl(globalUrl);
        return;
      }

      // 第二优先级：检查 sessionStorage（同一会话）
      const sessionUrl = getSessionBackground();
      if (sessionUrl) {
        setBackgroundUrl(sessionUrl);
        setGlobalBackground(sessionUrl);
        return;
      }

      // 第三优先级：检查 localStorage 缓存
      let finalUrl = '';
      const cached = getCachedBackground();
      if (cached) {
        const isValid = await preloadImage(cached);
        if (isValid) {
          finalUrl = cached;
        } else {
          localStorage.removeItem(BG_CACHE_KEY);
        }
      }

      // 最后：获取新图片
      if (!finalUrl) {
        const newUrl = fetchNewBackground();
        const isValid = await preloadImage(newUrl);
        if (isValid) {
          finalUrl = newUrl;
          setCachedBackground(newUrl);
        }
      }

      // 更新所有层级
      if (finalUrl) {
        setBackgroundUrl(finalUrl);
        setGlobalBackground(finalUrl);
        setSessionBackground(finalUrl);
      }
    };

    initBackground();
  }, []);

  const setLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const refreshBackground = useCallback(async () => {
    const newUrl = fetchNewBackground();
    const isValid = await preloadImage(newUrl);

    if (isValid) {
      setBackgroundUrl(newUrl);
      setGlobalBackground(newUrl);
      setSessionBackground(newUrl);
      setCachedBackground(newUrl);
      setIsLoaded(false);
    }
  }, []);

  return (
    <BackgroundContext.Provider value={{ backgroundUrl, isLoaded, setLoaded, refreshBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
