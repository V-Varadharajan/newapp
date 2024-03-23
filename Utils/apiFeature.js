import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { ChatAppAddress, ChatAppABI } from '../Context/constants';

export const CheckIfWalletConnected = async () => {
    try {
        if (!window.ethereum) {
            return console.log('Install MetaMask');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_accounts',
        });

        const fistAccount = accounts[0] ;
        return fistAccount 
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const connectWallet = async () => {
    try {
        if (!window.ethereum) {
            return console.log('Install MetaMask');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });

        return accounts[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const fetchContract = (signerOrProvider) => new ethers.Contract(ChatAppAddress, ChatAppABI, signerOrProvider);

export const connectingWithContract = async () => {
    try {
        let provider;
        let signer = null;

        if (window.ethereum == null) {
            // If MetaMask is not installed, use the default provider for read-only access
            console.log("MetaMask not installed; using read-only defaults");
            provider = ethers.getDefaultProvider();
        } else {
            // Connect to the MetaMask EIP-1193 object for read-only and write access
            provider = new ethers.BrowserProvider(window.ethereum);

            signer = await provider.getSigner();
        }

        const contract = fetchContract(signer);

        return contract;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const converTime = (time) => {
    const newTime = new Date(time.toNumber());
    const realTime =
        newTime.getHours() +
        '/' +
        newTime.getMinutes() +
        '/' +
        newTime.getSeconds() +
        ' Date:' +
        newTime.getDate() +
        '/' +
        (newTime.getMonth() + 1) +
        '/' +
        newTime.getFullYear();
    return realTime;
};
