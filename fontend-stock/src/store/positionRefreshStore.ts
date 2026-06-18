import { create } from "zustand";

type PositionRefreshStore = {
  refreshVersion: number;
  triggerRefresh: () => void;
};

export const usePositionRefreshStore = create<PositionRefreshStore>((set) => ({
  refreshVersion: 0,
  triggerRefresh: () =>
    set((state) => ({ refreshVersion: state.refreshVersion + 1 })),
}));
