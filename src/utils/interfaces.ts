declare namespace Crown {
  interface Config {
    prod: boolean;
    port: number;
    database: string[];
    db: dbConfig;
    elixire: {
      instance_url: string;
      apikey: string;
    };
  }
  interface dbConfig {
    dbs: string[];
    url: string;
    port: number;
    apikey: {
      parts: number;
      length: number;
      separator: string;
    };
  }
  interface Artist {
    pronouns?: string[];
    name: string;
    link: string;
    desc?: string;
    img: string;
    hometown?: string;
    releases?: string[];
    booking?: {
      eu?: string;
      na?: string;
      asia?: string;
    };
    interviews?: string[];
    hidden: boolean;
  }
  interface Release {
    internal: string;
    title: string;
    desc: string;
    artists: string;
    date: string;
    artwork: string;
    link: string;
    hidden: boolean;
  }
  interface ArtistReponse {
    success: boolean;
    data?: Artist;
    error?: string;
  }
  interface ReleaseReponse {
    success: boolean;
    data?: Release;
    error?: string;
  }

  interface DefaultResponse {
    success: boolean;
    msg?: string;
    error?: string;
  }

  interface AllArtists {
    success: boolean;
    error?: string;
    data?: Artist[];
  }
  interface AllReleases {
    success: boolean;
    error?: string;
    data?: Release[];
  }
  interface User {
    success?: boolean;
    username: string;
    password: string;
  }
  interface CreatedUser {}
}

export = Crown;
