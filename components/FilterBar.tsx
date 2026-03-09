import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FilterType } from '../lib/types';
import { Colors, Spacing, Radius, FontSize } from '../lib/constants';

interface Props {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export function FilterBar({ filter, onFilterChange, counts }: Props) {
  return (
    <View style={styles.container}>
      {FILTERS.map(({ key, label }) => (
        <TouchableOpacity
          key={key}
          style={[styles.button, filter === key && styles.buttonActive]}
          onPress={() => onFilterChange(key)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: filter === key }}
        >
          <Text style={[styles.label, filter === key && styles.labelActive]}>
            {label}
          </Text>
          <View style={[styles.badge, filter === key && styles.badgeActive]}>
            <Text style={[styles.badgeText, filter === key && styles.badgeTextActive]}>
              {counts[key]}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonActive: {
    backgroundColor: Colors.accentDim,
    borderColor: Colors.accent,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.accentLight,
  },
  badge: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.full,
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: Colors.accent,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  badgeTextActive: {
    color: Colors.white,
  },
});
