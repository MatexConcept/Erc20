// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const DltToken = buildModule("Erc20TokenModule", (m) => {

  const dltToken = m.contract("DLToken");

  return { dltToken };


});

export default DltToken  ;