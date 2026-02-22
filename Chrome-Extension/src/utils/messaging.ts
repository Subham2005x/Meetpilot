// Chrome messaging typed wrappers
import type { ExtensionMessage } from '../types'

export function sendMessage(message: ExtensionMessage): void {
    chrome.runtime.sendMessage(message).catch(() => {
        // ignore — receiver may not be ready
    })
}

export function sendMessageToTab(tabId: number, message: ExtensionMessage): void {
    chrome.tabs.sendMessage(tabId, message).catch(() => { })
}

export function onMessage(
    handler: (message: ExtensionMessage, sender: chrome.runtime.MessageSender) => void | boolean | Promise<unknown>
): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const result = handler(message as ExtensionMessage, sender)
        if (result instanceof Promise) {
            result.then(sendResponse)
            return true
        }
        return result
    })
}
