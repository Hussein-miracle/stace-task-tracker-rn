import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTasks } from './lib/hooks/use-tasks';
import { TaskItem } from './components/TaskItem';
import { TaskInput } from './components/TaskInput';
import { FilterBar } from './components/FilterBar';
import { EmptyState } from './components/EmptyState';
import { Colors, Spacing, FontSize } from './lib/constants';
import { Task } from './lib/types';

export default function App() {
  const {
    tasks,
    filter,
    setFilter,
    isLoading,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    counts,
  } = useTasks();

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={toggleTask}
      onDelete={deleteTask}
    />
  );

  const renderEmpty = () =>
    isLoading ? null : <EmptyState filter={filter} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tasks</Text>
            <Text style={styles.subtitle}>
              {counts.active === 0
                ? 'All completed!'
                : `${counts.active} remaining`}
            </Text>
          </View>
          {counts.completed > 0 && (
            <TouchableOpacity
              onPress={clearCompleted}
              activeOpacity={0.7}
              style={styles.clearButton}
              accessibilityLabel="Clear completed tasks"
            >
              <Text style={styles.clearButtonText}>Clear done</Text>
            </TouchableOpacity>
          )}
        </View>
        <TaskInput onAdd={addTask} />

        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.accent} />
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={tasks.length === 0 ? styles.emptyList : undefined}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  clearButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 6,
    backgroundColor: Colors.dangerDim,
  },
  clearButtonText: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyList: {
    flex: 1,
  },
});
