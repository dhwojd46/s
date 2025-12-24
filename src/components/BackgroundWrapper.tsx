import { ReactNode } from 'react';
import { BackgroundProvider } from '../lib/backgroundContext';
import SharedBackground from './SharedBackground';

interface BackgroundWrapperProps {
  children: ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <BackgroundProvider>
      <SharedBackground />
      {children}
    </BackgroundProvider>
  );
}
