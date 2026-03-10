import { afterEach, describe, expect, it, vi } from 'vitest'

import { copyToClipboard } from './clipboard'

const originalClipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
const originalExecCommandDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand')

function restoreProperty<T extends object>(
  target: T,
  key: keyof T,
  descriptor: PropertyDescriptor | undefined,
) {
  if (descriptor) {
    Object.defineProperty(target, key, descriptor)
    return
  }

  delete target[key]
}

describe('copyToClipboard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    restoreProperty(navigator, 'clipboard', originalClipboardDescriptor)
    restoreProperty(document, 'execCommand', originalExecCommandDescriptor)
  })

  it('uses the async clipboard api when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    await copyToClipboard('hello world')

    expect(writeText).toHaveBeenCalledWith('hello world')
  })

  it('falls back to execCommand when clipboard api is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    })

    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    })

    await copyToClipboard('manual fallback')

    expect(document.execCommand).toHaveBeenCalledWith('copy')
  })

  it('removes the temporary textarea and rejects when fallback copy fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    })

    const execCommand = vi.fn().mockReturnValue(false)

    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    })

    const initialTextareas = document.querySelectorAll('textarea').length

    await expect(copyToClipboard('manual fallback')).rejects.toThrow('Copy command failed')
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelectorAll('textarea')).toHaveLength(initialTextareas)
  })
})
