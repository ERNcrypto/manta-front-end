import React, { useState } from 'react';
import { Form, Input, Grid, Header } from 'semantic-ui-react';
import MAToAtomicUnits from './utils/ui/MAToAtomicUnit';
import TxButton from './TxButton';
import formatPayloadForSubstrate from './utils/api/FormatPayloadForSubstrate.js';
import { useSubstrate } from './substrate-lib';
import { makeDefaultTxResHandler } from './utils/api/MakeTxResHandler';
import BN from 'bn.js';
import TxStatusDisplay from './utils/ui/TxStatusDisplay';

export default function Main ({ fromAccount }) {
  const PALLET_RPC = 'balances';
  const CALLABLE = 'transfer';

  const { api } = useSubstrate();
  const [unsub, setUnsub] = useState(null);
  const [addressTo, setAddressTo] = useState(null);
  const [amount, setAmount] = useState(null);
  const [status, setStatus] = useState(null);

  const generatePayload = () => {
    return formatPayloadForSubstrate([addressTo, MAToAtomicUnits(amount, api)]);
  };

  const submitTransaction = payload => {
    const txResHandler = makeDefaultTxResHandler(api, setStatus);
    const tx = api.tx[PALLET_RPC][CALLABLE](...payload);
    const unsub = tx.signAndSend(fromAccount, txResHandler);
    setUnsub(() => unsub);
  };

  const onClickSubmit = () => {
    const payload = generatePayload();
    submitTransaction(payload);
  };

  const formIsDisabled = status && status.isProcessing();
  const buttonIsDisabled = formIsDisabled || !addressTo || !amount;

  return (
    <Grid.Column width={8}>
      <Header textAlign='center'>Transfer MA Token</Header>
      <Form>
        <Form.Field style={{ width: '500px', textAlign: 'center', marginLeft: '2em' }}>
          <Input
            fluid
            label='To'
            type='text'
            placeholder='address'
            state='addressTo'
            onChange={e => setAddressTo(e.target.value)}
            disabled={formIsDisabled}
          />
        </Form.Field>
        <Form.Field style={{ width: '500px', marginLeft: '2em' }}>
          <Input
            fluid
            label='Amount'
            type='number'
            placeholder='MA'
            state='amount'
            onChange={e => setAmount(new BN(e.target.value))}
            disabled={formIsDisabled}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label='Submit'
            onClick={onClickSubmit}
            disabled={buttonIsDisabled}
          />
        </Form.Field>
        <TxStatusDisplay txStatus={status}/>
      </Form>
    </Grid.Column>
  );
}
