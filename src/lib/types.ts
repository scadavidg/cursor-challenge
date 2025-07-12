import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export type Album = {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
};

export type Track = {
  id: string;
  name: string;
  duration_ms: number;
  track_number: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
};

export type DeezerTrack = {
  id: number;
  title: string;
  duration: number;
  track_position: number;
  preview: string;
  link: string;
};

export type AlbumDetails = {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
  total_tracks: number;
  external_urls: {
    spotify: string;
  };
  tracks: {
    items: Track[];
  };
};

export type DeezerAlbumDetails = {
  id: number;
  title: string;
  artist: {
    id: number;
    name: string;
  };
  cover: string;
  cover_medium: string;
  cover_big: string;
  release_date: string;
  nb_tracks: number;
  link: string;
  tracks: {
    data: DeezerTrack[];
  };
};
