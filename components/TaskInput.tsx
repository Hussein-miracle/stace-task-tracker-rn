import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../lib/constants';

interface Props {
  onAdd: (text: string) => boolean;
}

export function TaskInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleAdd = () => {
    if (!text.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 1200);
      return;
    }

    const success = onAdd(text);
    if (success) {
      setText('');
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, hasError && styles.containerError]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={(t) => {
            setText(t);
            if (hasError) setHasError(false);
          }}
          placeholder="Add a new task…"
          placeholderTextColor={Colors.textMuted}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          blurOnSubmit={false}
          multiline={false}
          maxLength={200}
          autoCorrect
          accessibilityLabel="Task input"
        />
        <TouchableOpacity
          style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
          onPress={handleAdd}
          activeOpacity={0.7}
          accessibilityLabel="Add task"
          accessibilityRole="button"
          disabled={!text.trim()}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      {hasError && (
        <Text style={styles.errorText}>Please enter a task first</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingLeft: Spacing.md,
    paddingRight: 6,
    paddingVertical: 6,
  },
  containerError: {
    borderColor: Colors.danger,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
    minHeight: 38,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.35,
  },
  addButtonText: {
    fontSize: 24,
    color: Colors.white,
    lineHeight: 28,
    fontWeight: '300',
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.danger,
    paddingLeft: Spacing.xs,
  },
});
