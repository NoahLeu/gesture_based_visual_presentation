export function debounce<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return function executedFunction(...args: Parameters<F>): void {
        const later = () => {
            clearTimeout(timeout!);
            func(...args);
        };
        clearTimeout(timeout!);
        timeout = setTimeout(later, wait);
    };
};