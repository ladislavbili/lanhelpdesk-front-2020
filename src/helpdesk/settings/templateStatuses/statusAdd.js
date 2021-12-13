import React from 'react';
import {
  useMutation,
  useApolloClient,
} from "@apollo/client";
import classnames from "classnames";

import {
  FormGroup,
  Label,
} from 'reactstrap';
import {
  SketchPicker
} from "react-color";
import Select from 'react-select';
import SettingsInput from '../components/settingsInput';

import {
  useTranslation
} from "react-i18next";
import {
  translateAllSelectItems,
} from 'helperFunctions';
import {
  pickSelectStyle
} from "configs/components/select";
import {
  actions
} from 'configs/constants/statuses';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_STATUS_TEMPLATES,
  ADD_STATUS_TEMPLATE
} from './queries';

export default function StatusAdd( props ) {
  //data & queries
  const {
    history
  } = props;

  const {
    t
  } = useTranslation();
  const client = useApolloClient();

  const [ addStatusTemplate ] = useMutation( ADD_STATUS_TEMPLATE );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ color, setColor ] = React.useState( "#f759f2" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ icon, setIcon ] = React.useState( "fas fa-arrow-left" );
  const [ action, setAction ] = React.useState( translateAllSelectItems( actions, t )[ 0 ] );
  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addStatusFunc = () => {
    setSaving( true );
    addStatusTemplate( {
        variables: {
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
          icon,
          color,
          action: action.value,
        }
      } )
      .then( ( response ) => {
        setSaving( false );
        history.push( `/helpdesk/settings/statuses/${response.data.addStatusTemplate.id}` )
      } )
      .catch( ( err ) => {
        setSaving( false );
        addLocalError( err );
      } );
  }

  const cannotSave = () => {
    return saving || title.length === 0;
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20">
        {`${t('add')} ${t('statusTemplate').toLowerCase()}`}
      </h2>

      <SettingsInput
        required
        label={t('statusTitle')}
        id="title"
        value={title}
        onChange={(e)=> {
          setTitle(e.target.value);
        }}
        />

      <SettingsInput
        label={t('icon')}
        placeholder="fas fa-arrow-left"
        id="icon"
        value={icon}
        onChange={(e)=> {
          setIcon(e.target.value);
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
          onChange={e => setAction(e) }
          />
      </FormGroup>

      <SketchPicker
        id="color"
        color={color}
        onChangeComplete={value => setColor( value.hex )}
        />

      <div className="form-buttons-row">

        { cannotSave() &&
          <div className="message error-message ml-auto m-r-14">
            {t('fillAllRequiredInformation')}
          </div>
        }

        <button
          className={classnames(
            "btn",
            {"ml-auto": !cannotSave()}
          )}
          disabled={cannotSave()}
          onClick={addStatusFunc}
          >
          { saving ? `${t('adding')}...` : `${t('add')} ${t('status').toLowerCase()}` }
        </button>

      </div>
    </div>
  );
}