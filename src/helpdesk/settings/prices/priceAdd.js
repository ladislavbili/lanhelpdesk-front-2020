import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input } from 'reactstrap';
import Switch from "react-switch";
import Loading from 'components/loading';

import {  GET_PRICELISTS } from './index';

export const ADD_PRICELIST = gql`
mutation addPricelist($title: String!, $order: Int!, $afterHours: Int!, $def: Boolean!, $materialMargin: Int!, $materialMarginExtra: Int!, $prices: [CreatePriceInput]! ) {
  addPricelist(
    title: $title,
    order: $order,
    afterHours: $afterHours,
    def: $def,
    materialMargin: $materialMargin,
    materialMarginExtra: $materialMarginExtra,
    prices: $prices,
  ){
    id
    title
    order
    def
  }
}
`;

export const GET_TASK_TYPES = gql`
query {
  taskTypes {
    title
    id
    order
  }
}
`;

export const GET_TRIP_TYPES = gql`
query {
  tripTypes {
    title
    id
    order
  }
}
`;

export default function PricelistAdd(props){
  //data
  const { history, match } = props;
  const { data: taskTypesData, loading: taskTypesLoading, error: taskTypesError } = useQuery(GET_TASK_TYPES);
  const { data: tripTypesData, loading: tripTypesLoading, error: tripTypesError } = useQuery(GET_TRIP_TYPES);
  const [ addPricelist, {client} ] = useMutation(ADD_PRICELIST);

  const TASK_TYPES = ( taskTypesLoading ? [] : taskTypesData.taskTypes);
  const TRIP_TYPES = ( tripTypesLoading ? [] : tripTypesData.tripTypes);

  //state
  const [ title, setTitle ] = React.useState("");
  const [ order, setOrder ] = React.useState(0);
  const [ afterHours, setAfterHours ] = React.useState(0);
  const [ def, setDef ] = React.useState(false);
  const [ materialMargin, setMaterialMargin ] = React.useState(0);
  const [ materialMarginExtra, setMaterialMarginExtra ] = React.useState(0);

  const [ prices, setPrices ] = React.useState([]);
  const [ companies, setCompanies ] = React.useState([]);

  const [ saving, setSaving ] = React.useState(false);
  // sync
  React.useEffect( () => {
      if (!taskTypesLoading && ! tripTypesLoading){
        setPrices(taskTypesData.taskTypes.concat(tripTypesData.tripTypes));
      }
  }, [taskTypesLoading, tripTypesLoading]);

  //functions
  const addPricelistFunc = () => {
    setSaving( true );
    let newPrices = prices.map(p => {
      return {type: p.__typename, typeId: p.id, price: (p.price === "" || p.price === undefined ? 0 : parseFloat(p.price))}
    });
    addPricelist({ variables: {
      title,
      order: (order !== '' ? parseFloat(order) : 0),
      afterHours: (afterHours !== '' ? parseFloat(afterHours) : 0),
      def,
      materialMargin: (materialMargin !== '' ? parseFloat(materialMargin) : 0),
      materialMarginExtra: (materialMarginExtra !== '' ? parseFloat(materialMarginExtra) : 0),
      prices: newPrices,
    } }).then( ( response ) => {
      const allPricelists = client.readQuery({query: GET_PRICELISTS}).pricelists;
      const newPricelist = {...response.data.addPricelist, __typename: "Pricelist"};
      client.writeQuery({ query: GET_PRICELISTS, data: {pricelists: [...allPricelists, newPricelist ] } });
      history.push('/helpdesk/settings/pricelists/' + newPricelist.id)
    }).catch( (err) => {
      console.log(err.message);
    });
    setSaving( false );
  }

  if (taskTypesLoading || tripTypesLoading) {
    return <Loading />
  }
    return (
      <div>
        <label>
          <Switch
            checked={def}
            onChange={ () => setDef(!def) }
            height={22}
            checkedIcon={<span className="switchLabel">YES</span>}
            uncheckedIcon={<span className="switchLabel">NO</span>}
            onColor={"#0078D4"} />
          <span className="m-l-10">Default</span>
        </label>

          <FormGroup className="row m-b-10">
            <div className="m-r-10 w-20">
              <Label for="name">Pricelist name</Label>
            </div>
            <div className="flex">
              <Input type="text" name="name" id="name" placeholder="Enter pricelist name" value={title} onChange={ (e) => setTitle(e.target.value) } />
            </div>
          </FormGroup>

          <h3>Ceny úloh</h3>
          <div className="p-t-10 p-b-10">
            {
              TASK_TYPES.map((item,index)=>
              <FormGroup key={index} className="row m-b-10">
                <div className="m-r-10 w-20">
                  <Label for={item.title}>{item.title}</Label>
                </div>
                <div className="flex">
                  <Input
                    type="text"
                    name={item.title}
                    id={item.title}
                    placeholder="Enter price"
                    value={item.price}
                    onChange={(e)=>{
                      let newPrices = prices.map(p => {
                        if (p.__typename === "TaskType" && p.id === item.id){
                          return ({...p, price: e.target.value.replace(",", ".")});
                        } else {
                          return p;
                        }
                      });
                      setPrices(newPrices);
                    }} />
                </div>
              </FormGroup>
              )
            }
          </div>

          <h3>Ceny Výjazdov</h3>
            <div className="p-t-10 p-b-10">
              {
                TRIP_TYPES.map((item,index)=>
                <FormGroup key={index} className="row m-b-10">
                  <div className="m-r-10 w-20">
                    <Label for={item.title}>{item.title}</Label>
                  </div>
                  <div className="flex">
                    <Input
                      type="text"
                      name={item.title}
                      id={item.title}
                      placeholder="Enter price"
                      value={item.price}
                      onChange={(e)=>{
                        let newPrices = prices.map(p => {
                          if (p.__typename === "TripType" && p.id === item.id){
                            return ({...p, price: e.target.value.replace(",", ".")});
                          } else {
                            return p;
                          }
                        });
                        setPrices(newPrices);
                      }} />
                  </div>
                </FormGroup>
                )
              }
            </div>

          <h3>Všeobecné prirážky</h3>
          <div className="p-t-10 p-b-10">
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="afterPer">After hours percentage</Label>
              </div>
              <div className="flex">
                <Input type="text" name="afterPer" id="afterPer" placeholder="Enter after hours percentage" value={afterHours} onChange={(e)=>setAfterHours(e.target.value.replace(",", "."))} />
              </div>
            </FormGroup>
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="materMarg">Materials margin percentage 50-</Label>
              </div>
              <div className="flex">
                <Input type="text" name="materMarg" id="materMarg" placeholder="Enter materials margin percentage" value={materialMargin} onChange={(e)=>setMaterialMargin(e.target.value.replace(",", "."))} />
              </div>
            </FormGroup>
            <FormGroup className="row m-b-10">
              <div className="m-r-10 w-20">
                <Label for="materMarg+">Materials margin percentage 50+</Label>
              </div>
              <div className="flex">
                <Input type="text" name="materMarg+" id="materMarg+" placeholder="Enter materials margin percentage" value={materialMarginExtra} onChange={(e)=>setMaterialMarginExtra(e.target.value.replace(",", "."))}/>
              </div>
            </FormGroup>
          </div>

          <Button className="btn" disabled={saving} onClick={addPricelistFunc}>{saving?'Saving prices...':'Save prices'}</Button>
      </div>
    );
}
