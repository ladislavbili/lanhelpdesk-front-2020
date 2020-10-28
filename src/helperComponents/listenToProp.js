export default function ListenToProp( props ) {
  //data
  const {
    prop
  } = props;
  console.log( props );

  React.useEffect( () => {}, [ prop ] );

  return null;
}