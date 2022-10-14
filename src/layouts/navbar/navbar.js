import React, { useState, useEffect, useMemo } from "react";
import { Box, Modal } from "@material-ui/core";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { FaWallet } from "react-icons/fa";
import { BiExit } from "react-icons/bi";
import MetaMaskImg from "../../assets/image/wallet/metamask.png";
import Coin98Img from "../../assets/image/wallet/coin98.png";
import CoinbaseImg from "../../assets/image/wallet/coinbase.svg";
import WalletConnectImg from "../../assets/image/wallet/walletConnect.svg";
import {
  injected,
  walletConnect,
  trustWallet,
  binance_wallet,
  chainId,
  NETWORK_NAME,
} from "../../utils/connectors";
import { CONTRACTS } from "../../utils/constants";
import { BUSD_ABI } from "../../utils/abi";
import { NotificationManager } from "react-notifications";

import Web3 from "web3";

const Navbar = ({ balance, setBalance }) => {
  const { account, active, activate, deactivate } = useWeb3React();
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const [flagDrop, setDrop] = useState(false);

  // const HUNT_Contract = useMemo(() => (library ? new ethers.Contract(CONTRACTS.HUNT_TOKEN, HUNT_ABI, library.getSigner()) : null), [library]);

  const DESKTOP_CONNECTORS = {
    MetaMask: injected,
    WalletConnect: walletConnect,
    BinanceWallet: binance_wallet,
    TrustWallet: trustWallet,
  };
  const walletConnectors = DESKTOP_CONNECTORS;
  const handleSwitch = async () => {
    try {
      if (window.ethereum.networkVersion !== chainId) {
        await window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
          })
          .then(() => {
            //   setConnected(true);
          });
        console.log("You have successfully switched to Correct Network");
      }
    } catch (ex) {
      //   setConnected(false);
      NotificationManager.error(
        "Failed to switch to " + NETWORK_NAME + " network.",
        "ERROR",
        3000
      );
    }
  };

  const handleConnect = async (currentConnector) => {
    await activate(walletConnectors[currentConnector]);
    // set_wConnect(walletConnectors[currentConnector]);
    window.localStorage.setItem("CurrentWalletConnect", currentConnector);
    handleSwitch();
    // setConnected(true);
    handleClose();
  };

  const getBalance = async () => {
    try {
      var web31 = new Web3("https://data-seed-prebsc-1-s3.binance.org:8545/");
      let contract = new web31.eth.Contract(BUSD_ABI, CONTRACTS.BUSD);
      let tempBalance = await contract.methods.balanceOf(account).call();
      // let tempBalance = await contractDice.balanceOf(account);
      console.log(tempBalance);
      setBalance(parseInt(tempBalance) / Math.pow(10, 18));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const currentWalletState = window.localStorage.getItem(
      "CurrentWalletConnect"
    );
    currentWalletState && activate(walletConnectors[currentWalletState]);
    if (active) {
      getBalance();
    }
  }, [active]);

  return (
    <StyledComponent>
      {active ? <BalanceBox>Balance: {balance} BUSD</BalanceBox> : <></>}
      <ConnectWalletBtn
        onClick={() => {
          // if (window.localStorage.getItem("CurrentWalletConnect") !== '') {
          //     return;
          // }
          if (active) {
            setOpen(false);
            setDrop(!flagDrop);
          } else {
            setOpen(true);
          }
        }}
        onMouseLeave={() => {
          setDrop(false);
        }}
      >
        {active ? (
          account.slice(0, 6) + "..." + account.slice(-4)
        ) : (
          <>
            <FaWallet />
            <Box display={"flex"} ml={"10px"}>
              Connect
            </Box>
          </>
        )}
        {flagDrop ? (
          <DropBox
            onClick={async () => {
              setDrop(false);
              await deactivate(
                window.localStorage.getItem("CurrentWalletConnect")
              );
              window.localStorage.removeItem("CurrentWalletConnect");
            }}
          >
            <BiExit />
            Disconnect
          </DropBox>
        ) : (
          <></>
        )}
      </ConnectWalletBtn>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropComponent={CustomBackdrop_ConnectWallet}
      >
        <ModalBox>
          <UpText>Select Wallet</UpText>
          <DownText>
            Connect to the site below with one of our available wallet
            providers.
          </DownText>
          <ConnectPart>
            <ConnectWallet
              onClick={() => {
                handleConnect("MetaMask");
              }}
            >
              <Box display={"flex"} marginLeft={"5%"}>
                Metamask
              </Box>
              <Box display={"flex"} marginRight={"5%"}>
                <img src={MetaMaskImg} width={"24px"} height={"24px"} alt="" />
              </Box>
            </ConnectWallet>
            <ConnectWallet
              onClick={() => {
                // handleConnect("TrustWallet");
              }}
            >
              <Box display={"flex"} marginLeft={"5%"}>
                Coinbase Wallet
              </Box>
              <Box display={"flex"} marginRight={"5%"}>
                <img src={CoinbaseImg} width={"24px"} height={"24px"} alt="" />
              </Box>
            </ConnectWallet>
            <ConnectWallet
              onClick={() => {
                // handleConnect("WalletConnect");
              }}
            >
              <Box display={"flex"} marginLeft={"5%"}>
                WalletConnect
              </Box>
              <Box display={"flex"} marginRight={"5%"}>
                <img
                  src={WalletConnectImg}
                  width={"24px"}
                  height={"24px"}
                  alt=""
                />
              </Box>
            </ConnectWallet>
            <ConnectWallet
              onClick={() => {
                // handleConnect("MetaMask");
              }}
            >
              <Box display={"flex"} marginLeft={"5%"}>
                Coin98
              </Box>
              <Box display={"flex"} marginRight={"5%"}>
                <img src={Coin98Img} width={"24px"} height={"24px"} alt="" />
              </Box>
            </ConnectWallet>
          </ConnectPart>
        </ModalBox>
      </Modal>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
  padding: 0px 100px;
  box-sizing: border-box;
  height: 100px;
  align-items: center;
  justify-content: flex-end;
  background-color: #e5e5e5;
`;
const BalanceBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Inter", sans-serif !important;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: -0.01em;
  color: #333;
  margin-right: 20px;
  text-align: center;
  animation: fadeIn 1s;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ConnectWalletBtn = styled(Box)`
  display: flex;
  position: relative;
  width: 200px;
  height: 50px;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  background-color: #333;
  color: white;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    color: #ffd47d;
  }
`;

const ConnectWallet = styled(Box)`
  display: flex;
  width: 100%;
  flex: 1;
  margin-top: 2%;
  margin-bottom: 2%;
  justify-content: space-between;
  align-items: center;
  background: #f1f3f5;
  border-radius: 8px;
  &:hover {
    cursor: pointer;
    transition: 0.5s;
    background: #e1e3e5;
  }
`;

const ConnectPart = styled(Box)`
  display: flex;
  flex: 4;
  flex-direction: column;
  font-family: "Inter", sans-serif !important;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: -0.01em;
  color: #333;
`;

const UpText = styled(Box)`
  display: flex;
  flex: 1;
  align-items: center;
  font-family: "Inter", sans-serif !important;
  font-style: normal;
  letter-spacing: -0.01em;
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
  color: #333;
`;
const DownText = styled(Box)`
  display: flex;
  flex: 1;
  align-items: flex-start;
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;
  font-family: "Inter", sans-serif !important;
  font-style: normal;
  letter-spacing: -0.01em;
  color: #333;
`;

const ModalBox = styled(Box)`
  display: flex;
  width: 350px;
  height: 400px;
  flex-direction: column;
  background-color: white;
  border: none;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(100px) !important;
  border-radius: 20px !important;
  padding: 30px;
  transition: box-shadow 300ms;
  transition: transform 505ms cubic-bezier(0, 0, 0.2, 1) 0ms !important;
  outline: none;
  animation: back_animation1 0.5s 1;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  @keyframes back_animation1 {
    0% {
      opacity: 0%;
    }
    100% {
      opacity: 100%;
    }
  }
  @media (max-width: 600px) {
    transition: 0.5s !important;
    width: 300px;
  }
  @media (max-width: 450px) {
    transition: 0.5s !important;
    width: 200px;
    height: 330px;
  }
`;
const DropBox = styled(Box)`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  left: 0%;
  bottom: -40px;
  width: 150px;
  height: 40px;
  border-radius: 0px 0px 8px 8px;
  /* background: hsla(0,30%,100%,.8); */
  border: none;
  transition: 0.5s;
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: -0.01em;
  color: #333;
  cursor: pointer;
  &:hover {
    transition: 0.5s;
    /* box-shadow: 0px 10px 10px rgb(0 0 0  / 20%), inset 2px 2px 2px #fff; */
    /* background: white; */
    color: #93aebc;
  }
`;

export const CustomBackdrop_ConnectWallet = styled(Box)`
  width: 100%;
  height: 100%;
  position: fixed;
  background: black;
  opacity: 0.6;
`;

export default Navbar;
