import { create } from 'zustand';
import { TaskStatus, ServiceType } from '@prisma/client';

interface TaskFilters {
  status: TaskStatus | 'ALL';
  serviceType: ServiceType | 'ALL';
  assignedToId: string | 'ALL';
}

interface TaskState {
  filters: TaskFilters;
  setFilter: (key: keyof TaskFilters, value: string) => void;
  resetFilters: () => void;
  isCreateModalOpen: boolean;
  setCreateModalOpen: (isOpen: boolean) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  filters: {
    status: 'ALL',
    serviceType: 'ALL',
    assignedToId: 'ALL',
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () =>
    set({
      filters: {
        status: 'ALL',
        serviceType: 'ALL',
        assignedToId: 'ALL',
      },
    }),
  isCreateModalOpen: false,
  setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
}));
