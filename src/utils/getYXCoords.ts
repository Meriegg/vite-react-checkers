export default (pieceCoords: number[] | null) => {
  if (!pieceCoords) return { x: null, y: null }

  const y = pieceCoords[0];
  const x = pieceCoords[1];

  return { x, y }
}