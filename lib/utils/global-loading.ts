type Listener = (isVisible: boolean) => void

const listeners = new Set<Listener>()
let pendingCount = 0

function notify() {
    const state = pendingCount > 0
    listeners.forEach((listener) => listener(state))
}

export function subscribeToGlobalLoading(listener: Listener) {
    listeners.add(listener)
    listener(pendingCount > 0)
    return () => {
        listeners.delete(listener)
    }
}

export function beginGlobalLoading() {
    pendingCount += 1
    notify()
}

export function endGlobalLoading() {
    pendingCount = Math.max(0, pendingCount - 1)
    notify()
}

export async function withGlobalLoading<T>(callback: () => Promise<T>) {
    beginGlobalLoading()
    try {
        return await callback()
    } finally {
        endGlobalLoading()
    }
}
