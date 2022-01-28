import React from 'react';
import {
  useTranslation
} from "react-i18next";
import {
  Modal,
  ModalBody,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
let fakeId = -1;

export default function AddressForm( props ) {
  const {
    address,
    open,
    close,
    edit,
    onChange,
  } = props;
  const {
    t
  } = useTranslation();

  const [ nic, setNic ] = React.useState( edit ? address.nic : '' );
  const [ ip, setIp ] = React.useState( edit ? address.ip : '' );
  const [ mask, setMask ] = React.useState( edit ? address.mask : '' );
  const [ gateway, setGateway ] = React.useState( edit ? address.gateway : '' );
  const [ dns, setDns ] = React.useState( edit ? address.dns : '' );
  const [ vlan, setVlan ] = React.useState( edit ? address.vlan : '' );
  const [ note, setNote ] = React.useState( edit ? address.note : '' );

  React.useEffect( () => {
    if ( open ) {
      setNic( edit ? address.nic : '' );
      setIp( edit ? address.ip : '' );
      setMask( edit ? address.mask : '' );
      setGateway( edit ? address.gateway : '' );
      setDns( edit ? address.dns : '' );
      setVlan( edit ? address.vlan : '' );
      setNote( edit ? address.note : '' );
    }
  }, [ open ] );

  return (
    <Modal isOpen={open}>
      <ModalBody>
        <div className="m-20">
          <h2>{`${edit ? t('edit') : t('add')} ${t('address2').toLowerCase()}`}</h2>
          <FormGroup>
            <Label htmlFor="nic">{t('nic')}</Label>
            <Input id="nic" className="form-control" placeholder={t('nicPlaceholder')} value={nic} onChange={(e) => setNic(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="ip">{t('ip')}</Label>
            <Input id="ip" className="form-control" placeholder={t('ipPlaceholder')} value={ip} onChange={(e) => setIp(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="mask">{t('mask')}</Label>
            <Input id="mask" className="form-control" placeholder={t('maskPlaceholder')} value={mask} onChange={(e) => setMask(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="gateway">{t('gateway')}</Label>
            <Input id="gateway" className="form-control" placeholder={t('gatewayPlaceholder')} value={gateway} onChange={(e) => setGateway(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="dns">{t('dns')}</Label>
            <Input id="dns" className="form-control" placeholder={t('dnsPlaceholder')} value={dns} onChange={(e) => setDns(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="vlan">{t('vlan')}</Label>
            <Input id="vlan" className="form-control" placeholder={t('vlanPlaceholder')} value={vlan} onChange={(e) => setVlan(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="note">{t('note')}</Label>
            <Textarea className="form-control" id="note" placeholder={t('notePlaceholder')} value={note} minRows={4} onChange={(e) => setNote(e.target.value)} />
          </FormGroup>


          <div className="row buttons">
            <button
              className="btn btn-link-cancel"
              onClick={close}
              >
              {t('close')}
            </button>
            <button  className="btn ml-auto" disabled={nic.length === 0 } onClick={() => onChange({
                id: edit ? address.id : fakeId--,
                nic,
                ip,
                mask,
                gateway,
                dns,
                vlan,
                note,
              })} >
              {`${ edit ? t('save') : t('add')} ${t('address2').toLowerCase()}`}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}