import React, { useState, useCallback } from 'react';
import FormInput from 'components/elements/Form/FormInput';
import Button from 'components/elements/Button';
import { useSubstrate } from 'contexts/substrateContext';
import Svgs from 'resources/icons';
import { useExternalAccount } from 'contexts/externalAccountContext';
import TxStatus from 'types/TxStatus';
import { makeTxResHandler } from 'utils/api/MakeTxResHandler';
import MantaLoading from 'components/elements/Loading';
import { showError, showSuccess } from 'utils/ui/Notifications';
import { useTxStatus } from 'contexts/txStatusContext';
import PropTypes from 'prop-types';
import AssetType from 'types/AssetType';
import Balance from 'types/Balance';
import getBalanceString from 'utils/ui/getBalanceString';
import {
  getIsInsuficientFunds,
  getTransferButtonIsDisabled
} from 'utils/ui/formValidation';
import Decimal from 'decimal.js';
import { useNativeTokenWallet } from 'contexts/nativeTokenWalletContext';

const NativeTokenSendTab = ({ selectedAssetType }) => {
  const { api } = useSubstrate();
  const { externalAccount, externalAccountSigner } = useExternalAccount();
  const { txStatus, setTxStatus } = useTxStatus();
  const { getUserCanPayFee, nativeTokenBalance } = useNativeTokenWallet();

  const [publicTransferAmount, setPublicTransferAmount] = useState(null);
  const [sendAmountInput, setSendAmountInput] = useState(null);
  const [receivingAddress, setReceivingAddress] = useState('');
  const [addressInfoText, setAddressInfoText] = useState('Receiver');

  const onPublicTransferSuccess = async (block) => {
    showSuccess('Transfer successful');
    setTxStatus(TxStatus.finalized(block));
  };

  const onPublicTransferFailure = (block, error) => {
    setTxStatus(TxStatus.failed(block, error));
    showError('Transfer failed');
  };

  const onPublicTransferUpdate = (message) => {
    setTxStatus(TxStatus.processing(message));
  };

  const handleUserCannotPayFee = () => {
    setTxStatus(TxStatus.failed());
    showError('Transfer failed: cannot pay fee');
  };

  const onClickSend = async () => {
    setTxStatus(TxStatus.processing());

    const txResHandler = makeTxResHandler(
      api,
      onPublicTransferSuccess,
      onPublicTransferFailure,
      onPublicTransferUpdate
    );

    try {
      const tx = api.tx.balances.transfer(
        receivingAddress,
        publicTransferAmount.valueAtomicUnits
      );
      const userCanPayFee = await getUserCanPayFee(tx);
      if (!userCanPayFee) {
        handleUserCannotPayFee();
        return;
      }
      await tx.signAndSend(externalAccountSigner, txResHandler);
    } catch (error) {
      console.error(error);
      onPublicTransferFailure();
    }
  };

  const insufficientFunds = getIsInsuficientFunds(
    publicTransferAmount,
    nativeTokenBalance
  );
  const buttonIsDisabled = getTransferButtonIsDisabled(
    publicTransferAmount,
    receivingAddress,
    insufficientFunds,
    txStatus
  );

  const onChangeSendAmountInput = (amountStr) => {
    setSendAmountInput(amountStr);
    try {
      setPublicTransferAmount(
        Balance.fromBaseUnits(selectedAssetType, new Decimal(amountStr))
      );
    } catch (error) {
      setPublicTransferAmount(null);
    }
  };

  const onClickMax = useCallback(() => {
    nativeTokenBalance &&
      onChangeSendAmountInput(nativeTokenBalance.toString(false));
  });

  const onChangeReceivingAddress = (address) => {
    if (!address.length) {
      setReceivingAddress(null);
      setAddressInfoText('Receiver');
      return;
    }
    try {
      api.createType('AccountId', address);
      setReceivingAddress(address);
      setAddressInfoText('Receiver');
    } catch (e) {
      setReceivingAddress(null);
      setAddressInfoText('Invalid address');
    }
  };

  return (
    <div className="send-content">
      <div className="py-2">
        <FormInput
          value={sendAmountInput}
          onChange={(e) => onChangeSendAmountInput(e.target.value)}
          onClickMax={onClickMax}
          type="number"
        >
          {getBalanceString(nativeTokenBalance)}
        </FormInput>
      </div>
      <img className="mx-auto" src={Svgs.ArrowDownIcon} alt="switch-icon" />
      <div className="py-2">
        <FormInput
          onChange={(e) => onChangeReceivingAddress(e.target.value)}
          prefixIcon={Svgs.WalletIcon}
          isMax={false}
          type="text"
        >
          {addressInfoText}
        </FormInput>
      </div>
      {txStatus?.isProcessing() ? (
        <MantaLoading className="py-4" />
      ) : (
        <Button
          onClick={onClickSend}
          disabled={buttonIsDisabled}
          className="btn-primary btn-hover w-full text-lg py-3"
        >
          Send
        </Button>
      )}
    </div>
  );
};

NativeTokenSendTab.propTypes = {
  selectedAssetType: PropTypes.instanceOf(AssetType)
};

export default NativeTokenSendTab;
