import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("DLT TOKEN", function () {
    async function deployDltTokenFixture() {
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const DltToken = await hre.ethers.getContractFactory("DLToken");
      const token = await DltToken.deploy("OpToken", "OP");
  
      return { token, owner, otherAccount };
      }

      describe("Deployment", () => {
    
        it("Should return the correct token name", async function () {
          const { token } = await loadFixture(deployDltTokenFixture);
          
         
          const tokenName = await token.getTokenName();

          
          expect(tokenName).to.equal("OpToken");
      });

      it("Should return the correct token symbol", async function () {
        const { token } = await loadFixture(deployDltTokenFixture);
        
       
        const tokenSymbol = await token.getSymbol();

        
        expect(tokenSymbol).to.equal("OP");
    });

 
     
      });

    
    
})