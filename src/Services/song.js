import axios from "./axiosConfig";

export const lanaDelReySongs = () => axios.get("song/lana-del-rey");

export const taylorSwiftSongs = () => axios.get("song/taylor-swift");

export const randomArtistsSongs = () => axios.get("song/random");
