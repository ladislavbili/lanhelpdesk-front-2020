export const snapshotToArray = (snapshot) => {
  if(snapshot.empty){
    return [];
  }
  return snapshot.docs.map((item)=>{
    return {id:item.id,...item.data()};
  })
}
