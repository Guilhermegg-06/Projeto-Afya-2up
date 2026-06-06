export function readFavorites(storageKey) {
    try {
        return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    } catch {
        return [];
    }
}

export function updateFavorite(storageKey, id, checked) {
    const normalizedId = String(id);
    const current = new Set(readFavorites(storageKey).map(String));

    if (checked) {
        current.add(normalizedId);
    } else {
        current.delete(normalizedId);
    }

    const next = Array.from(current);
    localStorage.setItem(storageKey, JSON.stringify(next));
    return next;
}
