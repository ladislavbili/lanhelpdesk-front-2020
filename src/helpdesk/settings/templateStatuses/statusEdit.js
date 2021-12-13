import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import classnames from 'classnames';

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  SketchPicker
} from "react-color";
import {
  useTranslation
} from "react-i18next";
import Select from 'react-select';
import Loading from 'components/loading';
import SettingsInput from '../components/settingsInput';
import DeleteReplacement from 'components/deleteReplacement';

import {
  actions
} from 'configs/constants/statuses';
import {
  pickSelectStyle
} from "configs/components/select";
import {
  toSelArr,
  translateAllSelectItems,
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
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();
  const client = useApolloClient();

  const allStatuses = toSelArr( client.readQuery( {
      query: GET_STATUS_TEMPLATES
    } )
    .statusTemplates );
  const filteredStatuses = allStatuses.filter( status => status.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allStatuses.length === 0;

  const {
    data: statusTemplateData,
    loading: statusTemplateLoading,
    refetch: statusTemplateRefetch
  } = useQuery( GET_STATUS_TEMPLATE, {
    variables: {
      id: parseInt( props.match.params.id )
    },
    fetchPolicy: 'network-only',
  } );

  const [ updateStatus ] = useMutation( UPDATE_STATUS_TEMPLATE );
  const [ deleteStatus ] = useMutation( DELETE_STATUS_TEMPLATE );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ color, setColor ] = React.useState( "#f759f2" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ icon, setIcon ] = React.useState( "fas fa-arrow-left" );
  const [ action, setAction ] = React.useState( translateAllSelectItems( actions, t )[ 0 ] );

  const [ saving, setSaving ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );

  // sync
  React.useEffect( () => {
    setData();
  }, [ statusTemplateLoading ] );

  React.useEffect( () => {
    statusTemplateRefetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( statusTemplateLoading ) {
      return;
    }
    const statusTemplate = statusTemplateData.statusTemplate;
    setTitle( statusTemplate.title );
    setColor( statusTemplate.color );
    setOrder( statusTemplate.order );
    setIcon( statusTemplate.icon );
    setAction( translateAllSelectItems( actions, t )
      .find( a => a.value === statusTemplate.action ) );

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

    if ( window.confirm( t( 'generalConfirmation' ) ) ) {
      deleteStatus( {
          variables: {
            id: parseInt( match.params.id ),
          }
        } )
        .then( ( response ) => {
          history.push( '/helpdesk/settings/statuses' );
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  if ( statusTemplateLoading ) {
    return <Loading />
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20" >
        {`${t('edit')} ${t('statusTemplate').toLowerCase()}`}
      </h2>

      <SettingsInput
        required
        label={t('statusTitle')}
        id="title"
        value={title}
        onChange={(e)=> {
          setTitle(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        label={t('icon')}
        placeholder="fas fa-arrow-left"
        id="icon"
        value={icon}
        onChange={(e)=> {
          setIcon(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        label={t('order')}
        placeholder={t('lowerMeansFirst')}
        type="number"
        id="order"
        value={order}
        onChange={(e)=> {
          setOrder(e.target.value);
          setDataChanged( true );
        }}
        />

      <FormGroup>
        <Label for="actionIfSelected">{t('actionIfSelected')}</Label>
        <Select
          id="actionIfSelected"
          name="Action"
          styles={pickSelectStyle()}
          options={translateAllSelectItems(actions, t)}
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
          {t('delete')}
        </button>

        <div className="ml-auto message m-r-10">
          { dataChanged &&
            <div className="message error-message">
              {t('saveBeforeLeaving')}
            </div>
          }
          { !dataChanged &&
            <div className="message success-message">
              {t('saved')}
            </div>
          }
        </div>

        <button
          className="btn m-t-5"
          disabled={saving}
          onClick={updateStatusFunc}>
          { saving ? `${t('saving')}...` : `${t('save')} ${t('status').toLowerCase()}` }
        </button>
      </div>
    </div>
  );
}