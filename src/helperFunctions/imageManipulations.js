export const uint8ArrayToImg = ( arr ) => {
  const blob = new Blob( [ arr ], {
    type: "image/jpeg"
  } );
  const img = URL.createObjectURL( blob );
  return img;
};