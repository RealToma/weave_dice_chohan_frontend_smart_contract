import React, { useState, useEffect, useMemo } from "react";

import { Box } from "@material-ui/core";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { NotificationManager } from "react-notifications";
import { BUSD_ABI, DICE_ABI } from "../utils/abi";
import { ethers } from "ethers";
import { CONTRACTS } from "../utils/constants";
import Web3 from "web3";
import ReactDice from "react-dice-complete";
import "react-dice-complete/dist/react-dice-complete.css";

const MainPage = ({ balance, setBalance }) => {
  const [flagBetType, setFlagBetType] = useState(true);
  const { account, active, library } = useWeb3React();
  const [amount, setAmount] = useState("");
  const [lastResult, setLastResult] = useState();
  const [dice01, setDice01] = useState(1);
  const [dice02, setDice02] = useState(1);
  const [flagBtnRoll, setFlagBtnRoll] = useState(0);

  const contractDice = useMemo(
    () =>
      library
        ? new ethers.Contract(CONTRACTS.DICE, DICE_ABI, library.getSigner())
        : null,
    [library]
  );

  const contractBusd = useMemo(
    () =>
      library
        ? new ethers.Contract(CONTRACTS.BUSD, BUSD_ABI, library.getSigner())
        : null,
    [library]
  );

  useEffect(() => {
    if (active) {
      getLastResult();
      getBalance();
    }
  }, [active, balance]);

  const isWin = (value1, value2) => {
    if ((value1 + value2) % 2 === 0) {
      return true;
    }
    return false;
  };

  const getLastResult = async () => {
    const tempResult = await contractDice.getLast10Result();
    console.log(tempResult);
    setLastResult(tempResult);
  };

  const getBalance = async () => {
    var web31 = new Web3("https://data-seed-prebsc-1-s3.binance.org:8545/");
    let contract = new web31.eth.Contract(BUSD_ABI, CONTRACTS.BUSD);
    let tempBalance = await contract.methods.balanceOf(account).call();
    setBalance(parseInt(tempBalance) / Math.pow(10, 18));
  };

  const handleRoll = async () => {
    if (flagBtnRoll === 1) {
      NotificationManager.error("", "Wait for result of rolling!", 3000);
      return;
    }
    if (flagBtnRoll === 2) {
      NotificationManager.error(
        "",
        `Please click ${
          isWin(dice01, dice02) === flagBetType ? "claim" : "play again"
        } button before roll!`,
        3000
      );
      return;
    }
    if (active === false) {
      NotificationManager.error("", "Please connect wallet!", 3000);
      return;
    }
    if (amount === "") {
      NotificationManager.error("", "Enter amount to lay stakes!", 3000);
      return;
    }
    if (amount <= 0) {
      NotificationManager.error(
        "",
        "Entered amount should be greater than zero.",
        3000
      );
      return;
    }
    if (amount > balance) {
      NotificationManager.error(
        "",
        "Entered amount should be less than your balance.",
        3000
      );
      return;
    }
    setFlagBtnRoll(1);
    const approveBUSD = await contractBusd.approve(
      CONTRACTS.DICE,
      "0x" + (amount * Math.pow(10, 18)).toString(16)
    );

    await approveBUSD.wait();

    const resRoll = await contractDice.roll(
      "0x" + (amount * Math.pow(10, 18)).toString(16),
      flagBetType
    );
    let res = await resRoll.wait();
    setDice01(res.events[1].args[1]);
    setDice02(res.events[1].args[2]);
    setFlagBtnRoll(2);
    getBalance();
    getLastResult();
  };

  const handleClaim = async () => {
    const claim = await contractDice.claim();
    await claim.wait();
    setFlagBtnRoll(0);
    setFlagBetType(true);
    getBalance();
    getLastResult();
  };
  return (
    <StyledComponent>
      <PartMain01>
        <ButtonSwitchBetType>
          <Box display={"flex"} width="100%" height="100%">
            <ButtonLeft01
              onClick={() => {
                if (flagBtnRoll === 1) {
                  NotificationManager.error(
                    "",
                    "Wait for result of rolling!",
                    3000
                  );
                  return;
                }
                if (flagBtnRoll === 2) {
                  NotificationManager.error(
                    "",
                    `Please click ${
                      isWin(dice01, dice02) === flagBetType
                        ? "claim"
                        : "play again"
                    } button before roll!`,
                    3000
                  );
                  return;
                }
                setFlagBetType(true);
              }}
              flag={flagBetType ? 1 : 0}
            >
              CHO (EVEN)
            </ButtonLeft01>
            <ButtonRight01
              onClick={() => {
                if (flagBtnRoll === 1) {
                  NotificationManager.error(
                    "",
                    "Wait for result of rolling!",
                    3000
                  );
                  return;
                }
                if (flagBtnRoll === 2) {
                  NotificationManager.error(
                    "",
                    `Please click ${
                      isWin(dice01, dice02) === flagBetType
                        ? "claim"
                        : "play again"
                    } button before roll!`,
                    3000
                  );
                  return;
                }
                setFlagBetType(false);
              }}
              flag={flagBetType ? 1 : 0}
            >
              HAN (ODD)
            </ButtonRight01>
          </Box>
        </ButtonSwitchBetType>
        <InputAmout01
          component="input"
          type="number"
          placeholder="Enter amount to lay stakes"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        ></InputAmout01>
        <ButtonRoll01
          onClick={() => {
            handleRoll();
          }}
        >
          Roll
        </ButtonRoll01>
        <PartRoll01>
          {/* {flagBtnRoll === 0 ? (
            <>
              <ReactDice
                numDice={1}
                defaultRoll={dice01}
                faceColor={"rgb(167,22,22"}
                dotColor={"white"}
                dieSize={"100"}
                rollTime={0}
                margin={"50"}
                disableIndividual={true}
              />
              <ReactDice
                numDice={1}
                defaultRoll={dice01}
                faceColor={"rgb(167,22,22"}
                dotColor={"white"}
                dieSize={"100"}
                rollTime={0}
                margin={"50"}
                disableIndividual={true}
              />
            </>
          ) : flagBtnRoll === 1 ? (
            <>
              <ReactDice
                numDice={1}
                defaultRoll={dice01}
                faceColor={"rgb(167,22,22"}
                dotColor={"white"}
                dieSize={"100"}
                rollTime={0}
                margin={"50"}
                disableIndividual={true}
              />
              <ReactDice
                numDice={1}
                defaultRoll={dice02}
                faceColor={"rgb(167,22,22"}
                dotColor={"white"}
                dieSize={"100"}
                rollTime={0}
                margin={"50"}
                disableIndividual={true}
              />
            </>
          ) : (
            <>
              <ReactDice
                numDice={1}
                defaultRoll={dice01}
                faceColor={"rgb(167,22,22"}
                dotColor={"white"}
                dieSize={"100"}
                rollTime={3}
                margin={"50"}
                disableIndividual={true}
              />
              <ReactDice
                numDice={1}
                defaultRoll={dice02}
                faceColor={"rgb(167,22,22"}
                dotColor={"white"}
                dieSize={"100"}
                rollTime={3}
                margin={"50"}
                disableIndividual={true}
              />
            </>
          )} */}
          {/* <ReactDice
            numDice={1}
            defaultRoll={3}
            faceColor={"rgb(167,22,22"}
            dotColor={"white"}
            dieSize={"100"}
            rollTime={3}
            margin={"50"}
            disableIndividual={false}
          />
          <ReactDice
            numDice={1}
            defaultRoll={6}
            faceColor={"rgb(167,22,22"}
            dotColor={"white"}
            dieSize={"100"}
            rollTime={3}
            margin={"50"}
            disableIndividual={false}
          /> */}
        </PartRoll01>
        {flagBtnRoll === 2 ? (
          <PartResult01>
            <TextResult001>
              Dice1 is {dice01}, Dice2 is {dice02}, so you{" "}
              {isWin(dice01, dice02) === flagBetType ? "won" : "lost"} {amount}{" "}
              BUSD.
            </TextResult001>

            <ButtonResult01 onClick={() => handleClaim()}>
              {" "}
              {isWin(dice01, dice02) === flagBetType ? "Claim" : "Play again"}
            </ButtonResult01>
          </PartResult01>
        ) : (
          <></>
        )}
      </PartMain01>
      <PartList01>
        <Title01>Latest 10 Game Results</Title01>
        {lastResult?.map((each, index) => {
          return (
            <EachResult01 key={index}>
              <TextRank01>No.{index + 1}</TextRank01>
              <PartRightResult01>
                <TextResultUser01>
                  User: {lastResult[index][0]}
                </TextResultUser01>
                <TextEachResult01>
                  Result:{" "}
                  {isWin(lastResult[index][1], lastResult[index][2]) ===
                  lastResult[index][3]
                    ? `Won ${
                        parseInt(lastResult[index][4].toString()) /
                        Math.pow(10, 18)
                      } BUSD!`
                    : `Lost ${
                        parseInt(lastResult[index][4].toString()) /
                        Math.pow(10, 18)
                      } BUSD!`}
                </TextEachResult01>
                <TextDetails01>
                  Details: Staked{" "}
                  {parseInt(lastResult[index][4].toString()) / Math.pow(10, 18)}{" "}
                  BUSD, bet {lastResult[index][3] ? "CHO(EVEN)" : "HAN(ODD)"}{" "}
                  and value of Dice1 was {lastResult[index][1]} and Dice2 was{" "}
                  {lastResult[index][2]}, so{" "}
                  {isWin(lastResult[index][1], lastResult[index][2]) ===
                  lastResult[index][3]
                    ? `won ${
                        parseInt(lastResult[index][4].toString()) /
                        Math.pow(10, 18)
                      } BUSD`
                    : `lost ${
                        parseInt(lastResult[index][4].toString()) /
                        Math.pow(10, 18)
                      } BUSD`}
                  .
                </TextDetails01>
              </PartRightResult01>
            </EachResult01>
          );
        })}
      </PartList01>
    </StyledComponent>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 100px 100px;
  box-sizing: border-box;
  align-items: center;
  flex-direction: column;
`;

const PartMain01 = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  align-items: center;

  /* justify-content: center; */
`;

const PartList01 = styled(Box)`
  display: flex;
  width: 1200px;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const ButtonSwitchBetType = styled(Box)`
  display: flex;
  width: 500px;
  height: 80px;
  background: #ffffff;

  border-radius: 8px;
  padding: 3px;
  box-sizing: border-box;
  align-items: center;

  transition: 0.5s;

  &:hover {
    box-shadow: 0px 0px 30px black;
  }
  @media (max-width: 1250px) {
    margin-left: 10px;
  }
  @media (max-width: 1024px) {
    margin-left: 0px;
    margin-right: 30px;
    width: 100px;
    height: 30px;
  }
  @media (max-width: 500px) {
    box-shadow: 0px 5px 20px rgba(69, 62, 194, 0.25);
    margin-right: 10px;
  }
  @media (max-width: 400px) {
    width: 80px;
  }
`;

const ButtonLeft01 = styled(Box)`
  display: flex;
  width: 250px;
  height: 100%;
  color: ${({ flag }) => (!flag ? "#333" : "#ffffff")};
  background: ${({ flag }) => (!flag ? "white" : "#333")};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 28px;
  /* identical to box height, or 175% */

  text-align: center;
  letter-spacing: -0.015em;
  text-transform: uppercase;
  cursor: pointer;

  transition: 0.3s;

  @media (max-width: 1024px) {
    font-size: 14px;
    width: 50px;
  }
  @media (max-width: 400px) {
    font-size: 12px;
    width: 40px;
  }
`;

const ButtonRight01 = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 28px;
  /* identical to box height, or 175% */

  text-align: center;
  letter-spacing: -0.015em;
  text-transform: uppercase;
  color: ${({ flag }) => (flag ? "#333" : "#ffffff")};
  background: ${({ flag }) => (flag ? "white" : "#333")};
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  @media (max-width: 1024px) {
    font-size: 14px;
    width: 50px;
  }
  @media (max-width: 400px) {
    font-size: 12px;
    width: 40px;
  }
`;

const InputAmout01 = styled(Box)`
  display: flex;
  margin-top: 50px;
  width: 500px;
  height: 80px;
  outline: none;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 0px 20px;
  box-sizing: border-box;
  font-size: 30px;

  transition: 0.5s;
  &:hover {
    box-shadow: 0px 0px 30px black;
  }
`;

const ButtonRoll01 = styled(Box)`
  display: flex;
  margin-top: 50px;
  width: 500px;
  height: 80px;
  /* border: 2px solid #333; */
  border-radius: 8px;
  background-color: #333;
  color: white;
  font-size: 30px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  transition: 0.5s;
  &:hover {
    color: #ffd47d;
  }
`;

const PartResult01 = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 50px;
  flex-direction: column;
  align-items: center;
`;

const Title01 = styled(Box)`
  display: flex;
  font-size: 40px;
  font-weight: 700;
  color: #333;
`;

const EachResult01 = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  margin-top: 50px;
  color: #333;
`;

const TextRank01 = styled(Box)`
  display: flex;
  width: 100px;
  font-size: 25px;
  font-weight: 600;
`;

const PartRightResult01 = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const TextResultUser01 = styled(Box)`
  display: flex;
  font-size: 20px;
  font-weight: 600;
`;

const TextEachResult01 = styled(Box)`
  display: flex;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
`;
const TextDetails01 = styled(Box)`
  display: flex;
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
`;

const PartRoll01 = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 50px;
  justify-content: center;
`;

const TextResult001 = styled(Box)`
  display: flex;
  font-size: 20px;
  font-weight: 500;
`;

const ButtonResult01 = styled(Box)`
  display: flex;
  margin-top: 50px;
  width: 300px;
  height: 80px;
  /* border: 2px solid #333; */
  border-radius: 8px;
  background-color: #333;
  color: white;
  font-size: 30px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  transition: 0.5s;
  &:hover {
    color: #ffd47d;
  }
`;

export default MainPage;
