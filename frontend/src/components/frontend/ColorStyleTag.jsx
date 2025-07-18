// components/frontend/ColorStyleTag.jsx

export default function ColorStyleTag({ colors }) {
  if (!colors) return null;

  //  just output raw value (hex or rgba) as a CSS var
  const cssVars = Object.entries(colors)
    .filter(([, val]) => val != null) // skip undefined/null
    .map(([key, val]) => `--color-${key}: ${val};`) // use val, not val.value
    .join('\n');

  return <style>{`:root {\n${cssVars}\n}`}</style>;
}
