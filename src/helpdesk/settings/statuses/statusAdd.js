import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, FormGroup, Label,Input } from 'reactstrap';
import { SketchPicker } from "react-color";
import Select from 'react-select';
import {selectStyle} from "configs/components/select";
import { actions } from 'configs/constants/statuses';

import {  GET_STATUSES } from './index';

const ADD_STATUS = gql`
mutation addStatus($title: String!, $order: Int!, $icon: String!, $color: String!, $action: StatusAllowedType!) {
  addStatus(
    title: $title,
    order: $order,
    icon: $icon,
    color: $color,
    action: $action,
  ){
    id
    title
    order
  }
}
`;

export default function StatusAdd(props){
  //data & queries
  const { history, match } = props;
  const [ addStatus, {client} ] = useMutation(ADD_STATUS);

  //state
  const [ title, setTitle ] = React.useState("");
  const [ color, setColor ] = React.useState("#f759f2");
  const [ order, setOrder ] = React.useState(0);
  const [ icon, setIcon ] = React.useState("fas fa-arrow-left");
  const [ action, setAction ] = React.useState(actions[0]);
  const [ saving, setSaving ] = React.useState(false);

  //functions
  const addStatusFunc = () => {
    setSaving( true );
    addStatus({ variables: {
      title,
      order: (order !== '' ? parseInt(order) : 0),
      icon,
      color,
      action: action.value,
    } }).then( ( response ) => {
      const allStatuses = client.readQuery({query: GET_STATUSES}).statuses;
      const newStatus = {...response.data.addStatus, __typename: "Status"};
      client.writeQuery({ query: GET_STATUSES, data: {statuses: [...allStatuses, newStatus ] } });
      history.push('/helpdesk/settings/statuses/' + newStatus.id)
    }).catch( (err) => {
      console.log(err.message);
    });
    setSaving( false );
  }

    return (
      <div className="scroll-visible p-20 fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="name">Status name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter status name" value={title} onChange={(e)=>setTitle(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label for="icon">Icon</Label>
            <Input type="text" name="icon" id="icon" placeholder="fas fa-arrow-left" value={icon} onChange={(e)=>setIcon(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label for="order">Order</Label>
            <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label for="actionIfSelected">Action if selected</Label>
            <Select
              id="actionIfSelected"
              name="Action"
              styles={selectStyle}
              options={actions}
              value={action}
              onChange={e => setAction(e) }
                />
          </FormGroup>
          <SketchPicker
            id="color"
            color={color}
            onChangeComplete={value => setColor( value.hex )}
          />
        <Button className="btn m-t-5" disabled={saving} onClick={addStatusFunc}>{saving?'Adding...':'Add status'}</Button>
      </div>
    );
}
