import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  lanaDelReySongs,
  randomArtistsSongs,
  taylorSwiftSongs,
} from "../../Services/song";
import { getCurrentUser, selectUser } from "../../Store/Slices/userSlice";

export const Home = () => {
  const [songs, setSongs] = useState([]);
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

  const callSongsAPIs = async () => {
    const responses = await Promise.allSettled([
      lanaDelReySongs(),
      taylorSwiftSongs(),
      randomArtistsSongs(),
    ]);

    for (const response of responses) {
      if (response.status === "fulfilled") {
        const { songs } = response.value.data;
        setSongs((prevSongs) => {
          return [...prevSongs, ...songs];
        });
      } else {
        // handle error here
        console.log("response ===> ", response.value.data);
      }
    }
  };

  console.log("SONGS ===> ", songs);

  return (
    <div className="flex justify-center items-center flex-col w-full gap-3">
      {userInfo ? (
        <div className="flex justify-center items-center flex-col">
          <h1>Name: {userInfo.name}</h1>
          <h1>Email: {userInfo.email}</h1>
        </div>
      ) : null}

      <button
        onClick={callSongsAPIs}
        className="border rounded-md border-solid border-black p-1"
      >
        Dispatch Multiple APIs
      </button>
    </div>
  );
};
