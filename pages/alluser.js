import React, { useState, useEffect, useContext } from "react";
import { ChatAppContect,UserLists } from "../Context/ChatAppContext";
import { UserCard } from "../components/index";
import Style from "../styles/alluser.module.css";

const alluser = () => {
  const { userLists, addFriends, readMessage, loading, error } = useContext(ChatAppContect);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className={Style.alluser_info}>
        <h1>Find Your Friends</h1>
      </div>
      <div className={Style.alluser}>
        {userLists.map((el, i) => (
          <UserCard key={i + 1} el={el} i={i} addFriends={addFriends} readMessage={() => readMessage(el.address)} />
        ))}
      </div>
    </div>
  );
};
export default alluser;
