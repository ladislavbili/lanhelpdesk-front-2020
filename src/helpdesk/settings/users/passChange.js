import React from 'react';
import {
  Button,
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

export default function PasswordChange( props ) {
  const {
    submitPass,
    isOpen,
  } = props;
  const [ newPass, setNewPass ] = React.useState( "" );
  const [ showPass, setShowPass ] = React.useState( false );
  const [ newPassCheck, setNewPassCheck ] = React.useState( "" );
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>
        Write a new password and repeat it.
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label htmlFor="new-pass">New Password</Label>
          <InputGroup>
            <Input type={showPass?'text':"password"} className="from-control" placeholder="Enter password" value={newPass} id="new-pass" onChange={ (e) => setNewPass(e.target.value) } />
            <InputGroupAddon addonType="append" className="clickable" onClick={ () => setShowPass(!showPass) }>
              <InputGroupText>
                <i className={"mt-auto mb-auto "+ (!showPass ?'fa fa-eye':'fa fa-eye-slash')}/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="pass-test">New Password Check</Label>
          <Input type="password" id="pass-test" placeholder="Re-ender password" value={newPassCheck} onChange={ (e) => setNewPassCheck(e.target.value) } />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button className="btn-link mr-auto"onClick={() => submitPass(null)}>
          Cancel
        </Button>
        <Button className="btn ml-auto" disabled={newPass.length < 6 || newPass !== newPassCheck } onClick={() => submitPass(newPass)}>
          Change password
        </Button>
      </ModalFooter>
    </Modal>
  )
}