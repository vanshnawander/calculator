import React from 'react';
import { Text, TextStyle } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  style?: TextStyle;
}

export const CalculatorIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Text style={[{ fontSize: size, color, fontWeight: 'bold' }, style]}>🧮</Text>
);

export const InfoIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Text style={[{ fontSize: size, color, fontWeight: 'bold' }, style]}>ℹ️</Text>
);

export const PrinterIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Text style={[{ fontSize: size, color, fontWeight: 'bold' }, style]}>🖨️</Text>
);

export const ShareIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Text style={[{ fontSize: size, color, fontWeight: 'bold' }, style]}>📤</Text>
);

export const CalendarIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Text style={[{ fontSize: size, color, fontWeight: 'bold' }, style]}>📅</Text>
);
