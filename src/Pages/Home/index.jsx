import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, selectUser } from "../../Store/Slices/userSlice";

export const Home = () => {
  const dispatch = useDispatch();
  const apiRef = useRef(true);
  const userInfo = useSelector(selectUser);

  useEffect(() => {
    if (apiRef.current) {
      dispatch(getCurrentUser());
      apiRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      Home
      {userInfo ? <h1>I have user info</h1> : null}
    </div>
  );
};
