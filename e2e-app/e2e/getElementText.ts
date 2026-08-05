import { IndexableNativeElement } from 'detox/detox'

export async function getElementText(element: IndexableNativeElement): Promise<string> {
  const attributes = (await element.getAttributes()) as { text?: string; label?: string } | undefined
  return (attributes?.text ?? attributes?.label ?? '').trim()
}
