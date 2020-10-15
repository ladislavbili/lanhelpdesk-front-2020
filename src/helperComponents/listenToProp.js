export default function ListenToProp(props) {
  //data
  const {prop} = props;

  React.useEffect(() => {
    console.log(prop);
  }, [prop]);

  return null;
}
