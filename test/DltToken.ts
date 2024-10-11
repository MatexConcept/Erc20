import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import hre from "hardhat";

describe("DLT TOKEN", function () {
    async function deployDltTokenFixture() {
      const [owner, otherAccount, add1] = await hre.ethers.getSigners();
  
      const DltToken = await hre.ethers.getContractFactory("DLToken");
      const token = await DltToken.deploy("OpToken", "OP");
  
      return { token, owner, otherAccount, add1 };
      }

      describe("Token", () => {
    
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

    it("Should set the total supply for the owner ", async function () {
      const { token, owner } = await loadFixture(deployDltTokenFixture);
      const ownerBalance = await token.balanceOf(owner.address)
      
      const expectedSupply = BigInt(1000000) * BigInt(10 ** 18);
      expect(ownerBalance.toString()).to.equal(expectedSupply.toString());

    });

    it("Should get the decimal of  token ", async function () {
      const { token, owner } = await loadFixture(deployDltTokenFixture);

      expect(await token.getTokenName()).to.equal("OpToken");
      expect(await token.getSymbol()).to.equal("OP");
    });

    it("should check account bal", async function () {
      const {token, owner} = await loadFixture(deployDltTokenFixture)

      const balance = await token.connect(owner).balanceOf(owner.address)

      expect(balance).to.be.equal(await token.balanceOf(owner.address));
  })
     
      });

      describe("Transfers Token", function() {
        it("Should be able to transfer ", async function() {
            const { token, otherAccount } = await loadFixture(deployDltTokenFixture);

            await token.transfer(otherAccount.address, 2000);
            const otherBalance = await token.balanceOf(otherAccount.address);
            expect(otherBalance).to.equal(1900);
        })  

        it("Should revert if account is insufficient", async function () {
          const { token, otherAccount, owner } = await loadFixture(
            deployDltTokenFixture
          );
    
          const transferAmount = hre.ethers.parseUnits("2000", 18); 
    
          await expect(
            token.connect(otherAccount).transfer(owner.address, transferAmount)
          ).to.be.revertedWith("You can't transfer more than what is available");
        });

        it("Should burn 5% of every transferred amount to reduce supply", async function () {
            const { token, owner, otherAccount } = await loadFixture(deployDltTokenFixture);
            const initialSupply = BigInt(await token.getTotalSupply());
            await token.transfer(otherAccount.address, 2000);
            const newSupply = BigInt(await token.getTotalSupply());
            const amountTransferred = BigInt(2000);
            const burnAmount = amountTransferred * BigInt(5) / BigInt(100);
            const expectedNewSupply = initialSupply - burnAmount;
            expect(newSupply).to.equal(expectedNewSupply);
        });

        
    })

    describe("Approval ", () => {
      it("Should allow an account to approve another account to spend tokens", async function () {
          const { token, owner, otherAccount } = await loadFixture(deployDltTokenFixture);
          const approveAmount = 1000;

          await token.approve(otherAccount.address, approveAmount);
          expect(await token.allowance(owner.address, otherAccount.address)).to.equal(approveAmount);
      });


      it("Should revert if balance is insufficient for approval", async function () {
        const { token, otherAccount, add1 } = await loadFixture(
          deployDltTokenFixture
        );
        const approvalAmount = hre.ethers.parseUnits("1000", 18); 
  
        await expect(
          token.connect(otherAccount).approve(add1.address, approvalAmount)
        ).to.be.revertedWith("Balance is not enough");
      });
    

      it("Should reflect the correct allowance after approval", async function () {
          const { token, owner, otherAccount } = await loadFixture(deployDltTokenFixture);
          const approveAmount = 1000;

          await token.approve(otherAccount.address, approveAmount);
          expect(await token.allowance(owner.address, otherAccount.address)).to.equal(approveAmount);

        
          const newApproveAmount = 500;
          await token.approve(otherAccount.address, newApproveAmount);
          expect(await token.allowance(owner.address, otherAccount.address)).to.equal(newApproveAmount);
      });
  });
  
    
})