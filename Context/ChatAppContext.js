import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Internal import
import { CheckIfWalletConnected, connectWallet, connectingWithContract } from "../Utils/apiFeature";

export const ChatAppContect = React.createContext();

export const ChatAppProvider = ({ children }) => {
  // User data
  const [account, setAccount] = useState('');
  const [userName, setUserName] = useState('');
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");

  // Chat user data
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  // fetch data at the time of page load chatAppContext
  const fetchData = async () => {
    try {
      // get contract
      const contract = await connectingWithContract();
      // get account
      const connectAccount = await connectWallet();
      setAccount(connectAccount);
      // get user name
      const userName = await contract.getUserName(connectAccount);
      setUserName(userName);
      // get my friend list
      const friendLists = await contract.getMyFriendList();
      setFriendLists(friendLists);
      // get all app user list
      const userList = await contract.getAllAppUser();
      setUserLists(userList);
    } catch (error) {
      setError("Please Install and Connect your Wallet");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // read Message
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read);
    } catch (error) {
      setError("Currently, you have no messages");
      console.error(error);
    }
  };

  // create account
  const createAccount = async ({ name,accountAddress }) => {
    try {
      if (name || accountAddress ) return setError("Name and accountaddress, cannot be empty!");
      const contract = await connectingWithContract();
      const getCreatedUser = await contract.createAccount(name);
      setLoading(true);
      await getCreatedUser.wait();
      setLoading(true);
      window.location.reload();
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  // Add your Friends
  const addFriends = async ({ name, accountAddress }) => {
    try {
      if (name || accountAddress) throw new Error("Name and Account Address cannot be empty!");
      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(accountAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push('/');
      window.location.reload(); 
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  // send message to your friends 
  const sendMessage = async ({ msg, address }) => {
    try {
      if (msg || address) return setError("Please type your message and select a friend");
      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload(); // Refresh data after sending a message
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  // Read the user info 
  const readUser = async (userAddress) => {
    try {
      const contract = await connectingWithContract();
      const userName = await contract.getUserName(userAddress);
      setCurrentUserName(userName);
      setCurrentUserAddress(userAddress);
    } catch (error) {
      setError("Error while reading user info");
      console.error(error);
    }
  };

  return (
    <ChatAppContect.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        connectWallet,
        CheckIfWalletConnected,
        account,
        userName,
        friendLists,
        userLists,
        loading,
        error,
        currentUserName,
        currentUserAddress
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
