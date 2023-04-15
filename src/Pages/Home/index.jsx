import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  lanaDelReySongs,
  randomArtistsSongs,
  taylorSwiftSongs,
} from '../../Services/song';
import { getCurrentUser, selectUser } from '../../Store/Slices/userSlice';
import SpinnerButton from '../../Components/Button';

export const Home = () => {
  const [songs, setSongs] = useState([]);
  const dispatch = useDispatch();
  const apiRef = useRef(true);
  const userInfo = useSelector(selectUser);
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (apiRef.current) {
      dispatch(getCurrentUser());
      apiRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callSongsAPIs = async () => {
    setLoading(true);
    const responses = await Promise.allSettled([
      lanaDelReySongs(),
      taylorSwiftSongs(),
      randomArtistsSongs(),
    ]);

    setLoading(false);

    for (const response of responses) {
      if (response.status === 'fulfilled') {
        const { songs } = response.value.data;
        setSongs((prevSongs) => {
          return [...prevSongs, ...songs];
        });
      } else {
        setLoading(false);

        // handle error here
      }
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full gap-3">
      <h1 className="font-bold m-4">
        Please access your Dev Tools and navigate to both the Network and
        Cookies tabs in order to observe the Refresh Token Rotation and
        Automatic Retry Mechanism of Failed APIs with Stale Access Tokens.
      </h1>

      <h1 className="font-bold">
        Access Token Expiry time is 10 seconds. Refresh Token Expiry time is 300
        seconds.
      </h1>

      {userInfo ? (
        <div className="flex justify-center items-center flex-col">
          <h1>Name: {userInfo.name}</h1>
          <h1>Email: {userInfo.email}</h1>
        </div>
      ) : null}

      <SpinnerButton
        handleClick={callSongsAPIs}
        label={'Dispatch Multiple APIs'}
        isLoading={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />

      {songs.map((song) => {
        return (
          <ul key={crypto.randomUUID()}>
            <li>{song.track}</li>
          </ul>
        );
      })}
    </div>
  );
};
