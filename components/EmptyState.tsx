import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FilterType } from '../lib/types';
import { Colors, Spacing, FontSize } from '../lib/constants';

interface Props {
  filter: FilterType;
}

const STATES: Record<FilterType, { icon: string; title: string; subtitle: string }> = {
  all: {
    icon: '📋',
    title: 'No tasks yet',
    subtitle: 'Add something to get started',
  },
  active: {
    icon: '◎',
    title: 'All caught up',
    subtitle: 'No active tasks remaining',
  },
  completed: {
    icon: '◉',
    title: 'Nothing completed',
    subtitle: 'Start checking things off',
  },
};

export function EmptyState({ filter }: Props) {
  const { icon, title, subtitle } = STATES[filter];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 1.5,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 36,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
