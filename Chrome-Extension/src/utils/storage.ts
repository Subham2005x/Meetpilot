// Chrome storage typed wrappers
import { STORAGE_KEYS } from './constants'

export async function getStorageLocal<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key] ?? null)
        })
    })
}

export async function setStorageLocal(key: string, value: unknown): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve)
    })
}

export async function getStorageSync<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, (result) => {
            resolve(result[key] ?? null)
        })
    })
}

export async function setStorageSync(key: string, value: unknown): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.sync.set({ [key]: value }, resolve)
    })
}

export async function getAuthToken(): Promise<string | null> {
    return getStorageLocal<string>(STORAGE_KEYS.AUTH_TOKEN)
}

export async function getSidebarWidth(): Promise<number> {
    const width = await getStorageLocal<number>(STORAGE_KEYS.SIDEBAR_WIDTH)
    return width ?? 380
}

export async function setSidebarWidth(width: number): Promise<void> {
    return setStorageLocal(STORAGE_KEYS.SIDEBAR_WIDTH, width)
}
