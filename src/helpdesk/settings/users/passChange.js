import React from 'react';
import {
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon
} from 'reactstrap';

import {
  useTranslation
} from "react-i18next";

export default function PasswordChange( props ) {
  const {
    submitPass,
    isOpen,
  } = props;

  const {
    t
  } = useTranslation();
  const [ newPass, setNewPass ] = React.useState( "" );
  const [ showPass, setShowPass ] = React.useState( false );
  const [ newPassCheck, setNewPassCheck ] = React.useState( "" );
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>
        {t('changePasswordMessage')}
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label htmlFor="new-pass">{t('newPassword')}</Label>
          <InputGroup>
            <Input type={showPass?'text':"password"} className="from-control" placeholder={t('passwordPlaceholder')} value={newPass} id="new-pass" onChange={ (e) => setNewPass(e.target.value) } />
            <InputGroupAddon addonType="append" className="clickable" onClick={ () => setShowPass(!showPass) }>
              <InputGroupText>
                <i className={"mt-auto mb-auto " + (!showPass ? 'fa fa-eye' : 'fa fa-eye-slash')} />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="pass-test">{t('newPasswordCheck')}</Label>
          <Input type="password" id="pass-test" placeholder={t('newPasswordCheckPlaceholder')} value={newPassCheck} onChange={ (e) => setNewPassCheck(e.target.value) } />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <button className="btn-link mr-auto"onClick={() => submitPass(null)}>
          {t('cancel')}
        </button>
        <button className="btn ml-auto" disabled={newPass.length < 6 || newPass !== newPassCheck } onClick={() => submitPass(newPass)}>
          {t('changePassword')}
        </button>
      </ModalFooter>
    </Modal>
  )
}