import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function getAQIStatus(aqi: number) {
  if (aqi <= 50) {
    return {
      level: 'good',
      emoji: '😊',
      color: '#22c55e',
      gradient: 'from-green-500 to-green-400'
    };
  } else if (aqi <= 100) {
    return {
      level: 'moderate',
      emoji: '😐',
      color: '#facc15',
      gradient: 'from-yellow-500 to-yellow-400'
    };
  } else if (aqi <= 200) {
    return {
      level: 'unhealthy',
      emoji: '😷',
      color: '#f97316',
      gradient: 'from-orange-500 to-orange-400'
    };
  } else {
    return {
      level: 'hazardous',
      emoji: '😨',
      color: '#dc2626',
      gradient: 'from-red-500 to-red-400'
    };
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
