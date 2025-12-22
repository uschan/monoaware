
export interface HistoryItem {
  id: string;
  timestamp: number;
  appId: string;
  inputSummary: string;
  result: any;
}

const STORAGE_KEY = 'DEEP_DISSECT_HISTORY';
const MAX_ITEMS = 50; // Keep last 50 items to be safe

export const HistoryService = {
  getHistory: (): HistoryItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  },

  saveItem: (appId: string, input: any, result: any) => {
    try {
      const history = HistoryService.getHistory();
      
      // Create summary from input
      let summary = '';
      if (typeof input === 'string') {
        summary = input.length > 50 ? input.substring(0, 50) + '...' : input;
      } else if (typeof input === 'object') {
        // For complex objects like DecisionInput, try to find a meaningful field
        summary = input.title || input.concept || input.question || input.termA || JSON.stringify(input).substring(0, 50);
      }

      const newItem: HistoryItem = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        timestamp: Date.now(),
        appId,
        inputSummary: summary,
        result
      };

      // Add to front, slice to max size
      const updated = [newItem, ...history].slice(0, MAX_ITEMS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history", e);
      // If quota exceeded, clear half of old history and try again
      try {
        const history = HistoryService.getHistory();
        const pruned = history.slice(0, Math.floor(MAX_ITEMS / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
      } catch (retryError) {
        console.error("Critical storage error", retryError);
      }
    }
  },

  clearHistory: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  deleteItem: (id: string) => {
    const history = HistoryService.getHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
