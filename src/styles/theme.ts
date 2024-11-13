export const themeConfig = {
  card: {
    base: "bg-card rounded-lg shadow p-6",
    hover: "hover:bg-secondary dark:hover:bg-accent",
  },
  text: {
    base: "text-foreground dark:text-foreground",
    muted: "text-muted-foreground",
    title: "font-semibold",
  },
  status: {
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  badge: {
    base: "px-3 py-1 rounded-full text-sm font-medium",
  },
  container: {
    base: "space-y-8",
    header: "flex justify-between items-center",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  },
  input: {
    base: "bg-secondary dark:bg-accent p-3 rounded",
  },
  border: {
    base: "border border-border rounded",
  },
}
