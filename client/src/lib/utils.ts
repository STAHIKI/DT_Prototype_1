import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'connected':
    case 'active':
    case 'operational':
      return 'text-green-400';
    case 'disconnected':
    case 'inactive':
    case 'offline':
      return 'text-red-400';
    case 'processing':
    case 'pending':
      return 'text-yellow-400';
    default:
      return 'text-gray-400';
  }
}

export function getStatusBgColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'connected':
    case 'active':
    case 'operational':
      return 'bg-green-500';
    case 'disconnected':
    case 'inactive':
    case 'offline':
      return 'bg-red-500';
    case 'processing':
    case 'pending':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}
