import { Store, useStore } from "@tanstack/react-store";

const mediaResolutions = {
  xs: "(max-width: 380px)",
  sm: "(min-width: 381px) and (max-width: 576px)",
  md: "(min-width: 577px) and (max-width: 768px)",
  lg: "(min-width: 769px) and (max-width: 992px)",
  xl: "(min-width: 993px) and (max-width: 1200px)",
  'dual-lg': "(min-width: 1201px) and (max-width: 1884px)",
  'dual-xl': "(min-width: 1885px) and (max-width: 2400px)",
  'dual-xxl': "(min-width: 2401px)"
} as const;
type TViewport = keyof typeof mediaResolutions;
const mediaStore = new Store({
  viewport: 'xs' as TViewport
});

type TUseMedia = <Match extends TViewport[] | undefined = undefined>(match?: Match) => Match extends undefined ? TViewport : boolean;

export const useAppViewport: TUseMedia = (match?: Array<TViewport>) => {
  const { viewport } = useStore(mediaStore);

  if (!match) 
    return viewport as any;

  return match.includes(viewport);
};

const handleMediaChange = (viewport : TViewport) => (e: MediaQueryListEvent) => {
  if (e.matches)
    mediaStore.setState(() => ({ viewport }));
};

// Set initial viewport
Object.entries(mediaResolutions).forEach(([viewport, resolution]) => {
  if (window.matchMedia(resolution).matches)
    mediaStore.setState(() => ({ viewport: viewport as TViewport }))
});

// Listen for media changes
Object.entries(mediaResolutions).forEach(([viewport, resolution]) => {
  window
    .matchMedia(resolution)
    .addEventListener('change', handleMediaChange(viewport as TViewport));
});
