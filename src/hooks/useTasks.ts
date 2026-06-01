// =============================================================================
// FILE: src/hooks/useTasks.ts
// -----------------------------------------------------------------------------
// Yeh hook file TaskContext ke variables aur handlers ko export karti hai.
// =============================================================================

// Context se hook import karke re-export karna taaki hooks directory clean rahe
import { useTasks as useTasksContext } from '../context/TaskContext';

// Export hook logic
export const useTasks = useTasksContext;

export default useTasks;
