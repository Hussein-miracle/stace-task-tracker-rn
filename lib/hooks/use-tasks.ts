import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { FilterType, Task } from '../types';
import dayjs from 'dayjs';


const STORAGE_KEY = '@tasktracker:tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from AsyncStorage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setTasks(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Persist tasks to AsyncStorage whenever they change
  const saveTasks = useCallback(async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }, []);

  const addTask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return false;

      const newTask: Task = {
        id: uuidv4(),
        text: trimmed,
        completed: false,
        createdAt: dayjs().toISOString(),
      };

      const updated = [newTask, ...tasks];
      setTasks(updated);
      saveTasks(updated);
      return true;
    },
    [tasks, saveTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      const updated = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updated);
      saveTasks(updated);
    },
    [tasks, saveTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const updated = tasks.filter((task) => task.id !== id);
      setTasks(updated);
      saveTasks(updated);
    },
    [tasks, saveTasks]
  );

  const clearCompleted = useCallback(() => {
    const updated = tasks.filter((task) => !task.completed);
    setTasks(updated);
    saveTasks(updated);
  }, [tasks, saveTasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return {
    tasks: filteredTasks,
    filter,
    setFilter,
    isLoading,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    counts,
  };
}
