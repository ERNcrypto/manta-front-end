// @ts-nocheck
import React from 'react';
import DotLoader from 'components/Loaders/DotLoader';
import { useExternalAccount } from 'contexts/externalAccountContext';
import { useStakeData } from './StakeContext/StakeDataContext';

const AccountDisplay = () => {
  const {
    userTotalBalance,
    userAvailableBalance,
    userStakedBalance
  } = useStakeData();

  const { externalAccount } = useExternalAccount();

  const getBalanceDisplayString = (balance) => {
    if (!externalAccount) {
      return '';
    } else if (!balance) {
      return <DotLoader />;
    } else {
      return balance.toString(true, 0);
    }
  };

  const totalBalanceDisplayString = getBalanceDisplayString(userTotalBalance);
  const avialableBalanceDisplayString = getBalanceDisplayString(userAvailableBalance);
  const stakedBalanceDisplayString = getBalanceDisplayString(userStakedBalance);

  const onClickStartStaking = () =>  {
    const element = document.getElementById('collatorsTable');
    element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  };

  return (
    <div>
      <div className="flex xl:flex-nowrap justify-start flex-wrap-reverse gap-4">
        <div className="-mt-2 px-10 py-4 bg-secondary flex-grow rounded-lg gap-12 relative z-20 flex justify-evenly items-center shadow-2xl">
          <div className="mt-4">
            <h2 className="text-secondary text-center font-medium text-lg">
              Total Balance
            </h2>
            <h1 className="text-black dark:text-white font-bold text-xl text-center mt-4">
              {totalBalanceDisplayString}
            </h1>
            <button
              onClick={onClickStartStaking}
              className={
                'mt-8 p-3 cursor-pointer text-xl btn-hover unselectable-text text-center rounded-lg btn-primary w-full'}
            >
              Start staking
            </button>
          </div>
          <div className="flex justify-end gap-12">
            <div className=" w-52 h-52 rounded-md border-2 border-primary text-center pt-12 shadow-lg">
              <h2 className="text-secondary font-medium text-base">
                Available Balance
              </h2>
              <h1 className="text-black dark:text-white font-bold text-lg mt-4">
                {avialableBalanceDisplayString}
              </h1>
            </div>
            <div className=" w-52 h-52 rounded-md border-2 border-primary text-center pt-12 shadow-lg">
              <h2 className="text-secondary font-medium text-base">
                Total Staked
              </h2>
              <h1 className="text-black dark:text-white font-bold text-lg mt-4">
                {stakedBalanceDisplayString}
              </h1>
            </div>
          </div>
        </div>
        <div className="-mt-2 max-w-sm flex flex-grow flex-col items-center justify-center flex-shrink-0 py-4 bg-secondary rounded-lg relative z-20 shadow-2xl">
          <div>
            <h2 className="text-secondary font-medium text-lg">Resources</h2>
            <div className="mt-6">
              <a
                href="https://docs.manta.network/docs/calamari/Staking/Overview"
                className="text-link text-base"
                target="_blank"
                rel="noreferrer"
              >
                Staking documentation
              </a>
            </div>
            <div className="mt-6">
              <a
                href="https://calamari.subscan.io"
                className="text-link text-base"
                target="_blank"
                rel="noreferrer"
              >
                Calamari block explorer
              </a>
            </div>
            <div className="mt-6">
              <a
                href="https://stakekma.com"
                className="text-link text-base"
                target="_blank"
                rel="noreferrer"
              >
                StakeKMA collator dashboard
              </a>
            </div>
            <div className="mt-6">
              <a
                href="https://sparta.calamari.systems"
                className="text-link text-base"
                target="_blank"
                rel="noreferrer"
              >
                Calamari collator dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDisplay;
