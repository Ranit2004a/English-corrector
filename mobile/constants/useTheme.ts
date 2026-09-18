import { useSettingsStore } from '../store/useSettingsStore';
import { LightColors, DarkColors, LightNeuShadows, DarkNeuShadows } from './theme';

export function useTheme() {
  const isDark = useSettingsStore((state) => state.settings.dark_mode ?? false);

  const colors = isDark ? DarkColors : LightColors;
  const shadows = isDark ? DarkNeuShadows : LightNeuShadows;

  return {
    isDark,
    colors,
    shadows,
  };
}
