define([], function() {

    var TestFixtures = {

        artistListFixture: {
            "response": {
                "status": {
                    "code": "0",
                    "message": "Success",
                    "version": "4.2"
                },
                "artists": {
                    "artist": [
                        {
                            "name": "Radiohead",
                            "id": "ARH6W4X1187B99274F"
                        }
                    ]
                }
            }
        },

        paginatorFixture: {
            "response": {
                "status": {
                    "code": 0,
                        "message": "Success",
                        "version": "4.2"
                },
                "songs": [
                    {
                        "artist_id": "ARH6W4X1187B99274F",
                        "id": "SOCZZBT12A6310F251",
                        "artist_name": "Radiohead",
                        "title": "Karma Police"
                    }
                ]
            }
        },

        playlistsFixture:
            [{"title":"newpl","_id":"5159c02e2b77daf802000001","__v":0,"tracks":[]},
            {"title":"anotherpl","_id":"5159c0d0cf86650303000001","__v":0,"tracks":[]},
            {"title":"playlist2","_id":"5159d03c7095225104000001","__v":0,"tracks":[]},
            {"__v":1,"_id":"5159d41230b4c7a704000001","playlist_id":"5159d41230b4c7a704000001","title":"pl3","tracks":["5159d42530b4c7a704000002"]}
            ],


        playlistSongsFixture:
            [{"track_id":"newpl","api_id":"5159"},
                {"track_id":"anotherpl","api_id":"5159c0d"},
                {"track_id":"playlist2","api_id":"5159d03c"}
            ],


        radioTracksFixture: {
            "response": {
                "status": {
                    "code": 0,
                    "message": "Success",
                    "version": "4.2"
                },
                "songs": [

                        {"tracks":[
                            { "foreign_release_id":"spotify-WW:release:7nxBMFwJtTTKDNxVCKmYi3",
                              "catalog":"spotify-WW",
                              "foreign_id":"spotify-WW:track:62dfjIOvQXX7XGj9Zc6UkO",
                              "id":"TRWOMGL1338648CEE2"
                            }
                        ],
                            "artist_id":"ARRH63Y1187FB47783",
                            "id":"SOYHZUD13772662FDC",
                            "artist_name":"Kanye West",
                            "title":"Stronger"
                        },
                        {"tracks":[
                            { "foreign_release_id":"spotify-WW:release:4P63UgNDUcF11MnWzyvVrh",
                              "catalog":"spotify-WW",
                              "foreign_id":"spotify-WW:track:0RIGEVmc5IPQJ8VIjL1z98",
                              "id":"TRVRPUF1338646EAA0"
                            }
                        ],
                            "artist_id":"ARLGIX31187B9AE9A0",
                            "id":"SOATRTK136669464E6",
                            "artist_name":"Jay-Z",
                            "title":"Ni**as In Paris"
                        },
                        {"tracks":[
                            { "foreign_release_id":"spotify-WW:release:4DP4IfbpAvbm9HyPnSboiX",
                                "catalog":"spotify-WW",
                                "foreign_id":"spotify-WW:track:3dR46vRbZ3CdUrzlSFObzN",
                                "id":"TRGMCFM13386469C7A"
                            }
                        ],
                            "artist_id":"ARPFHN61187FB575F6",
                            "id":"SOFMWYP130516E071A",
                            "artist_name":"Lupe Fiasco",
                            "title":"Out Of My Head (feat. Trey Songz)"
                        }

                ]
            }
        },


        styleListFixture: {
            "response":{
                "status":{
                    "version":"4.2",
                    "code":0,
                    "message":"Success"
                },
                "terms": [
                    {"frequency":1,
                        "name":"rock"
                    },
                    {"frequency":0.9885200543481819,
                        "name":"electronic"
                    },
                    {"frequency":0.9596559389061107,
                        "name":"hip hop"
                    },
                    {"frequency":0.9537179849112485,
                        "name":"pop rock"
                    },
                    {"frequency":0.9429750789913315,
                        "name":"indie rock"
                    },
                    {"frequency":0.9413762640770791,
                        "name":"jazz"
                    },
                    {"frequency":0.9394927043180324,
                        "name":"techno"
                    },
                    {"frequency":0.9335641254821183,
                        "name":"hard rock"
                    },
                    {"frequency":0.9324655852691691,
                        "name":"electro"
                    },
                    {"frequency":0.9315775109532761,
                        "name":"disco"
                    }
                ]
            }
        },


        addToCustomPlaylistFixture: {
            "track_id":"5176b0e676e71d8f01000003",
            "track_name":"Mirrors",
            "api_id":"SOMCZYB13D2154627B",
            "spotify_id":"03gqZZavMKhWbSjdQvpF6O",
            "artist_name":"Justin Timberlake",
            "_id":"5176b0e676e71d8f01000003"
        }





    };

    return TestFixtures;
});
