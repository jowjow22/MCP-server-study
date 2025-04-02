export function formatDescription(description: string): string {
    return description
        .replace(/\n/g, '\\n')
        .replace(/"/g, '\\"')
        .trim();
}