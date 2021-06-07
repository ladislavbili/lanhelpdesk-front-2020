import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Loading from 'components/loading';
import {
  actions
} from 'configs/constants/statuses';
import {
  SketchPicker
} from "react-color";
import DeleteReplacement from 'components/deleteReplacement';
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";
import {
  toSelArr
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_STATUS_TEMPLATES,
  GET_STATUS_TEMPLATE,
  UPDATE_STATUS_TEMPLATE,
  DELETE_STATUS_TEMPLATE
} from './queries';

export default function StatusEdit( props ) {
  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_STATUS_TEMPLATE, {
    variables: {
      id: parseInt( props.match.params.id )
    },
    fetchPolicy: 'network-only',
  } );
  const [ updateStatus ] = useMutation( UPDATE_STATUS_TEMPLATE );
  const [ deleteStatus, {
    client
  } ] = useMutation( DELETE_STATUS_TEMPLATE );

  const allStatuses = toSelArr( client.readQuery( {
      query: GET_STATUS_TEMPLATES
    } )
    .statusTemplates );
  const filteredStatuses = allStatuses.filter( status => status.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allStatuses.length === 0;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ color, setColor ] = React.useState( "#f759f2" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ icon, setIcon ] = React.useState( "fas fa-arrow-left" );
  const [ action, setAction ] = React.useState( actions[ 0 ] );
  const [ saving, setSaving ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );

  const [ dataChanged, setDataChanged ] = React.useState( false );

  // sync
  React.useEffect( () => {
    setData();
  }, [ loading ] );

  React.useEffect( () => {
    refetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( loading ) {
      return;
    }
    setTitle( data.statusTemplate.title );
    setColor( data.statusTemplate.color );
    setOrder( data.statusTemplate.order );
    setIcon( data.statusTemplate.icon );
    setAction( actions.find( a => a.value === data.statusTemplate.action ) );

    setDataChanged( false );
  }

  const updateStatusFunc = () => {
    setSaving( true );
    updateStatus( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          icon,
          color,
          action: action.value,
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
    setDataChanged( false );
  };

  const deleteStatusFunc = () => {
    setDeleteOpen( false );

    if ( window.confirm( "Are you sure?" ) ) {
      deleteStatus( {
          variables: {
            id: parseInt( match.params.id ),
          }
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  if ( loading ) {
    return <Loading />
  }

  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { dataChanged &&
          <div className="message error-message">
            Save changes before leaving!
          </div>
        }
        { !dataChanged &&
          <div className="message success-message">
            Saved
          </div>
        }
      </div>

      <div className="scroll-visible p-l-20 p-r-20 p-b-20 p-t-10 fit-with-header-and-commandbar">

        <h2 className="m-b-20" >
          Edit status
        </h2>

        <FormGroup>
          <Label for="name">Status name <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Enter status name"
            value={title}
            onChange={ (e) =>  {
              setTitle(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>
        <FormGroup>
          <Label for="name">Icon</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="fas fa-arrow-left"
            value={icon}
            onChange={ (e) =>  {
              setIcon(e.target.value);
              setDataChanged( true );
            }}
            />
        </FormGroup>
        <FormGroup>
          <Label for="order">Order</Label>
          <Input
            type="number"
            name="order"
            id="order"
            placeholder="Lower means first"
            value={order}
            onChange={ (e) =>  {
              setOrder(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>
        <FormGroup>
          <Label for="actionIfSelected">Action if selected</Label>
          <Select
            id="actionIfSelected"
            name="Action"
            styles={pickSelectStyle()}
            options={actions}
            value={action}
            onChange={ e =>  {
              setAction(e) ;
              setDataChanged( true );
            }}
            />
        </FormGroup>
        <SketchPicker
          id="color"
          color={color}
          onChangeComplete={ value =>  {
            setColor( value.hex );
            setDataChanged( true );
          }}
          />

        <div className="form-buttons-row">
          <button
            className="btn-red m-l-5 m-t-5"
            disabled={saving || theOnlyOneLeft}
            onClick={ deleteStatusFunc }
            >
            Delete
          </button>
          <button className="btn m-t-5 ml-auto" disabled={saving} onClick={updateStatusFunc}>{saving?'Saving status...':'Save status'}</button>
        </div>
      </div>
    </div>
  );
}