export function decodeArrayIdsFromStr(data: string): number[] {
  return data.split(',').map(id => parseInt(id, 10));
}

export function encodeArrayIdsToStr(data: number[]): string {
  return data.join(',');
}
