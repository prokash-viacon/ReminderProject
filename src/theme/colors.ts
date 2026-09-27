export type AppColors = {
  background: string;
  surface: string;
  searchBg: string;
  inputBg: string;
  text: string;
  textSecondary: string;
  placeholder: string;
  border: string;
  primary: string;
  primaryContrast: string;
  danger: string;
  editAction: string;
  success: string;
  bannerBg: string;
  bannerText: string;
  errorBg: string;
  errorText: string;
  fabIcon: string;
  overlay: string;
  shadow: string;
};

export const lightColors: AppColors = {
  background: '#CEC5B4',
  surface: '#FFFFFF',
  searchBg: '#FFFFFF',
  inputBg: '#FFFFFF',
  text: '#26110D',
  textSecondary: '#5C4033',
  placeholder: '#A69B8F',
  border: '#E8DFD4',
  primary: '#FF5722',
  primaryContrast: '#FFFFFF',
  danger: '#C62828',
  editAction: '#5D4037',
  success: '#2E7D32',
  bannerBg: '#FFF4E5',
  bannerText: '#8A5A00',
  errorBg: '#FFECEC',
  errorText: '#8A1F1F',
  fabIcon: '#FFFFFF',
  overlay: 'rgba(38, 17, 13, 0.45)',
  shadow: '#26110D',
};

export const darkColors: AppColors = {
  background: '#2B2822',
  surface: '#222222',
  searchBg: '#1A1814',
  inputBg: '#F2F2F2',
  text: '#FFFFFF',
  textSecondary: '#B0A99F',
  placeholder: '#8A8580',
  border: '#3A3630',
  primary: '#FF5722',
  primaryContrast: '#FFFFFF',
  danger: '#E53935',
  editAction: '#8D6E63',
  success: '#66BB6A',
  bannerBg: '#3A2E14',
  bannerText: '#FFD60A',
  errorBg: '#3A1515',
  errorText: '#FF8A80',
  fabIcon: '#1A1814',
  overlay: 'rgba(0, 0, 0, 0.55)',
  shadow: '#000000',
};

export function getColors(isDark: boolean): AppColors {
  return isDark ? darkColors : lightColors;
}
