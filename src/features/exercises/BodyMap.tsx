import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Exercise, Muscle } from '../../types';
import { muscleColors } from '../../theme/tokens';
import { paths as front } from './front-paths';
import { paths as back } from './back-paths';

export function muscleColor(muscle: string) {
  if (['chest', 'shoulders'].includes(muscle)) return muscleColors[muscle as 'chest' | 'shoulders'];
  if (['upper_back', 'lats', 'lower_back', 'traps', 'neck'].includes(muscle)) return muscleColors.back;
  if (['biceps', 'triceps', 'forearms'].includes(muscle)) return muscleColors.arms;
  if (['abs', 'obliques'].includes(muscle)) return muscleColors.core;
  return muscleColors.legs;
}

export function BodyMap({ muscles = [], all = false, size = 140, onSelect }: {
  muscles?: Exercise['muscles']; all?: boolean; size?: number; onSelect?: (muscle: Muscle) => void;
}) {
  return <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
    {[front, back].map((paths, side) => <Svg key={side} width={size / 1.8} height={size} viewBox="0 0 100 180" accessibilityLabel={side ? 'Back muscles' : 'Front muscles'}>
      {paths.map(path => {
        const role = muscles.find(item => item.muscle === path.muscle)?.role;
        const selected = path.muscle !== 'neutral' && (role || all);
        return <Path key={path.id} d={path.d} fill={selected ? muscleColor(path.muscle) : '#CECED8'} opacity={role === 'secondary' ? 0.55 : 1}
          onPress={onSelect && path.muscle !== 'neutral' ? () => onSelect(path.muscle as Muscle) : undefined} />;
      })}
    </Svg>)}
  </View>;
}
