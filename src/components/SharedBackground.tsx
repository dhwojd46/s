import { memo, useState, useEffect } from 'react';
import { useBackground } from '../lib/backgroundContext';

const SharedBackground = memo(() => {
  const [hasError, setHasError] = useState(false);

  if (typeof window === 'undefined') {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />
    );
  }

  const { backgroundUrl, isLoaded, setLoaded } = useBackground();

  useEffect(() => {
    if (backgroundUrl) {
      setHasError(false);
    }
  }, [backgroundUrl]);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]">
      {backgroundUrl && !hasError && (
        <img
          src={backgroundUrl}
          alt="background"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="eager"
          onLoad={setLoaded}
          onError={handleError}
        />
      )}
    </div>
  );
});

SharedBackground.displayName = 'SharedBackground';

export default SharedBackground;
