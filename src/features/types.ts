export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}

/*authSlice.ts*/
export interface PROPS_AUTHEN {
    email: string;
    password: string;
}

export interface PROPS_PROFILE {
    id?: number;
    nickName: string;
    img?: File | null;
    fav_music_genre: string;
}

export interface PROPS_NICKNAME {
    nickName: string;
}

export interface PROPS_NEWPOST {
    description: string;
    img: File | null;
    playlist: string;
    genre: string;
}

export interface PROPS_LIKED {
    id: number;
    description: string;
    playlist: string;
    genre: string;
    current: number[];
    new: number;
}

export interface PROPS_COMMENT {
    text: string;
    post: number;
}

/*Post.tsx*/
export interface PROPS_POST {
    postId: number;
    loginId: number;
    userPost: number;
    description: string;
    imageUrl: string;
    liked: number[];
    playlist: string;
    genre: string;
}

export interface PROPS_PLAYLIST {
    userPlaylist: number;
    title: string;
    url: string;
}

export interface PROPS_NEWPLAYLIST {
    title: string;
    url: string;
}

export interface PROPS_AUDIOFEATURES {
    playlist :string ;
    acousticness :number ;
    danceability :number ;
    energy :number ;
    instrumentalness :number ;
    key :number ;
    liveness :number ;
    loudness :number ;
    mode :number ;
    speechiness :number ;
    tempo :number ;
    time_signature :number ;
    valence :number ;
}

export interface PROPS_NEWAUDIOFEATURES {
    playlist :any ;
    acousticness :any ;
    danceability :any ;
    energy :any ;
    instrumentalness :any ;
    key :any ;
    liveness :any ;
    loudness :any ;
    mode :any ;
    speechiness :any ;
    tempo :any ;
    time_signature :any ;
    valence :any ;
}

