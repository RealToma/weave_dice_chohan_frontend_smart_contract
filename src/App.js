import React, { useState } from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import Navbar from "../src/layouts/navbar/navbar";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import MainPage from "./Page/MainPage";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

const App = () => {
  const [balance, setBalance] = useState(0);
  return (
    <>
      <Web3ReactProvider getLibrary={getLibrary}>
        <StyledComponent>
          <Navbar balance={balance} setBalance={setBalance} />
          <MainPage balance={balance} />
          <NotificationContainer />
        </StyledComponent>
      </Web3ReactProvider>
    </>
  );
};

const StyledComponent = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: #e5e5e5;
`;
export default App;
