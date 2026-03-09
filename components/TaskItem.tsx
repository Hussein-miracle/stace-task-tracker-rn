import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { FontSize, Radius, Spacing, Colors } from '../lib/constants';
import { Task } from '../lib/types';
import dayjs from 'dayjs';


interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle(task.id);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.checkButton}
        onPress={handleToggle}
        activeOpacity={0.7}
        accessibilityLabel={task.completed ? 'Mark as active' : 'Mark as complete'}
        accessibilityRole="checkbox"
      >
        <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
          {task.completed && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.textArea}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.taskText, task.completed && styles.taskTextDone]}
          numberOfLines={3}
        >
          {task.text}
        </Text>
        <Text style={styles.timestamp}>
          {dayjs(task.createdAt).format('MMM D, h:mm A')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
        activeOpacity={0.7}
        accessibilityLabel="Delete task"
        accessibilityRole="button"
      >
        <Text style={styles.deleteIcon}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkButton: {
    marginRight: Spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  checkmark: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: '700',
    lineHeight: 14,
  },
  textArea: {
    flex: 1,
    gap: 3,
  },
  taskText: {
    fontSize: FontSize.md,
    color: Colors.text,  // make sure this is here
    fontWeight: '400',
    lineHeight: 21,
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
    backgroundColor: Colors.dangerDim,
  },
  deleteIcon: {
    fontSize: 20,
    color: Colors.danger,
    lineHeight: 22,
    fontWeight: '300',
  },
});
