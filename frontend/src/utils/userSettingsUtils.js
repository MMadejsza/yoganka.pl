import { queryClient } from './http.js';

export const applyFontSize = fontsize => {
  if (!fontsize) return;
  const fontSizePref = fontsize?.toLowerCase?.() || 'm';

  const scaleMap = {
    xs: 0.8,
    s: 0.9,
    m: 1,
    l: 1.1,
    xl: 1.2,
  };

  const scale = scaleMap[fontSizePref] ?? 1;

  if (typeof scale === 'number') {
    document.documentElement.style.setProperty('--scale', scale.toString());
  }
  queryClient.invalidateQueries(['authStatus']);
};
