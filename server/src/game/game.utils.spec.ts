import { extractPlayerStats, mergeStats } from './game.utils';
import { FormattedGame } from './Game';

const games: FormattedGame[] = [
    {
        rolls: [
            {
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 6,
                dice: 6
            },
            {
                total: 10,
                dice: 4,
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID3',
                    username: 'Hackl'
                }
            },
            {
                total: 15,
                dice: 5,
                player: {
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                total: 15,
                dice: 3,
                player: {
                    life: 6,
                    uid: 'TEST_UID3',
                    username: 'Hackl',
                    points: 0
                }
            },
            {
                total: 4,
                dice: 4,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 8,
                dice: 4,
                player: {
                    username: 'Hackl',
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID3'
                }
            },
            {
                player: {
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 8,
                dice: 3
            },
            {
                player: {
                    life: 6,
                    uid: 'TEST_UID3',
                    username: 'Hackl',
                    points: 0
                },
                total: 10,
                dice: 2
            },
            {
                player: {
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 12,
                dice: 2
            },
            {
                total: 14,
                dice: 2,
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID3',
                    username: 'Hackl'
                }
            },
            {
                total: 1,
                dice: 1,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 3,
                dice: 2,
                player: {
                    username: 'Hackl',
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID3'
                }
            },
            {
                total: 3,
                dice: 3,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 5,
                dice: 2,
                player: {
                    username: 'Hackl',
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID3'
                }
            },
            {
                total: 10,
                dice: 5,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 15,
                dice: 5,
                player: {
                    life: 6,
                    uid: 'TEST_UID3',
                    username: 'Hackl',
                    points: 0
                }
            },
            {
                total: 15,
                dice: 3,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 21,
                dice: 6,
                player: {
                    points: 0,
                    life: 0,
                    uid: 'TEST_UID3',
                    username: 'Hackl'
                }
            }
        ],
        startedAt: {
            _seconds: 1571684742,
            _nanoseconds: 461000000
        },
        players: [
            {
                points: 0,
                life: 0,
                uid: null,
                username: 'Hackl'
            },
            {
                username: 'DrDreo',
                points: 0,
                life: 4,
                uid: 'TEST_UID'
            }
        ],
        finishedAt: {
            _seconds: 1571684785,
            _nanoseconds: 505000000
        }
    },
    {
        finishedAt: {
            _seconds: 1571741106,
            _nanoseconds: 995000000
        },
        rolls: [
            {
                total: 4,
                dice: 4,
                player: {
                    username: 'xXx_David_xXx',
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID2'
                }
            },
            {
                total: 9,
                dice: 5,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 9,
                dice: 3,
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 10,
                dice: 1,
                player: {
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                total: 10,
                dice: 3,
                player: {
                    life: 6,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx',
                    points: 0
                }
            },
            {
                total: 16,
                dice: 6,
                player: {
                    life: 0,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            }
        ],
        startedAt: {
            _seconds: 1571741086,
            _nanoseconds: 438000000
        },
        players: [
            {
                points: 0,
                life: 0,
                uid: 'TEST_UID',
                username: 'DrDreo'
            },
            {
                points: 0,
                life: 6,
                uid: 'TEST_UID2',
                username: 'xXx_David_xXx'
            }
        ]
    },
    {
        startedAt: {
            _seconds: 1571684742,
            _nanoseconds: 461000000
        },
        finishedAt: {
            _seconds: 1571684785,
            _nanoseconds: 505000000
        },
        rolls: [
            {
                total: 5,
                dice: 5,
                player: {
                    points: 0,
                    life: 6,
                    uid: null,
                    username: 'Hackl'
                }
            },
            {
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID'
                },
                total: 7,
                dice: 2
            },
            {
                total: 8,
                dice: 1,
                player: {
                    points: 0,
                    life: 6,
                    uid: null,
                    username: 'Hackl'
                }
            },
            {
                total: 13,
                dice: 5,
                player: {
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                total: 1,
                dice: 1,
                player: {
                    life: 5,
                    uid: null,
                    username: 'Hackl',
                    points: 0
                }
            },
            {
                total: 3,
                dice: 2,
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 8,
                dice: 5,
                player: {
                    points: 0,
                    life: 5,
                    uid: null,
                    username: 'Hackl'
                }
            },
            {
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 10,
                dice: 2
            },
            {
                player: {
                    points: 0,
                    life: 5,
                    uid: null,
                    username: 'Hackl'
                },
                total: 11,
                dice: 1
            },
            {
                total: 2,
                dice: 2,
                player: {
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                total: 4,
                dice: 2,
                player: {
                    points: 0,
                    life: 5,
                    uid: null,
                    username: 'Hackl'
                }
            },
            {
                player: {
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 5,
                dice: 1
            },
            {
                total: 9,
                dice: 4,
                player: {
                    points: 0,
                    life: 5,
                    uid: null,
                    username: 'Hackl'
                }
            },
            {
                total: 13,
                dice: 4,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID'
                }
            },
            {
                player: {
                    life: 5,
                    uid: null,
                    username: 'Hackl',
                    points: 0
                },
                total: 14,
                dice: 1
            },
            {
                total: 6,
                dice: 6,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                player: {
                    life: 5,
                    uid: null,
                    username: 'Hackl',
                    points: 0
                },
                total: 6,
                dice: 3
            },
            {
                total: 8,
                dice: 2,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 13,
                dice: 5,
                player: {
                    points: 0,
                    life: 5,
                    uid: null,
                    username: 'Hackl'
                }
            },
            {
                total: 6,
                dice: 6,
                player: {
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                player: {
                    username: 'Hackl',
                    points: 0,
                    life: 5,
                    uid: null
                },
                total: 6,
                dice: 3
            },
            {
                player: {
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 6,
                dice: 3
            },
            {
                total: 12,
                dice: 6,
                player: {
                    username: 'Hackl',
                    points: 0,
                    life: 5,
                    uid: null
                }
            },
            {
                total: 5,
                dice: 5,
                player: {
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 6,
                dice: 1,
                player: {
                    life: 5,
                    uid: null,
                    username: 'Hackl',
                    points: 0
                }
            },
            {
                total: 12,
                dice: 6,
                player: {
                    life: 2,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                player: {
                    life: 0,
                    uid: null,
                    username: 'Hackl',
                    points: 0
                },
                total: 17,
                dice: 5
            }
        ],
        players: [
            {
                points: 0,
                life: 2,
                uid: 'TEST_UID',
                username: 'DrDreo'
            },
            {
                life: 0,
                uid: null,
                username: 'Hackl',
                points: 0
            }
        ]
    },
    {
        finishedAt: {
            _seconds: 1571741273,
            _nanoseconds: 960000000
        },
        rolls: [
            {
                total: 4,
                dice: 4,
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 10,
                dice: 6,
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                player: {
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 1,
                dice: 1
            },
            {
                total: 3,
                dice: 2,
                player: {
                    username: 'xXx_David_xXx',
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID2'
                }
            },
            {
                total: 8,
                dice: 5,
                player: {
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 8,
                dice: 3,
                player: {
                    life: 6,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx',
                    points: 0
                }
            },
            {
                total: 12,
                dice: 4,
                player: {
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                total: 6,
                dice: 6,
                player: {
                    username: 'xXx_David_xXx',
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID2'
                }
            },
            {
                total: 12,
                dice: 6,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 1,
                dice: 1,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                player: {
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                },
                total: 1,
                dice: 3
            },
            {
                total: 7,
                dice: 6,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 7,
                dice: 3,
                player: {
                    points: 0,
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 8,
                dice: 1,
                player: {
                    username: 'xXx_David_xXx',
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID2'
                }
            },
            {
                player: {
                    life: 5,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                },
                total: 12,
                dice: 4
            },
            {
                total: 14,
                dice: 2,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                },
                total: 2,
                dice: 2
            },
            {
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 8,
                dice: 6
            },
            {
                total: 9,
                dice: 1,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 14,
                dice: 5,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 1,
                dice: 1,
                player: {
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 2,
                dice: 1,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 2,
                dice: 3,
                player: {
                    username: 'xXx_David_xXx',
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID2'
                }
            },
            {
                total: 7,
                dice: 5,
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 9,
                dice: 2,
                player: {
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                player: {
                    points: 0,
                    life: 4,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 10,
                dice: 1
            },
            {
                total: 12,
                dice: 2,
                player: {
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 5,
                dice: 5,
                player: {
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 5,
                dice: 3,
                player: {
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 6,
                dice: 1,
                player: {
                    life: 3,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                total: 6,
                dice: 3,
                player: {
                    username: 'xXx_David_xXx',
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID2'
                }
            },
            {
                total: 7,
                dice: 1,
                player: {
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 13,
                dice: 6,
                player: {
                    points: 0,
                    life: 3,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 5,
                dice: 5,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 10,
                dice: 5,
                player: {
                    life: 3,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx',
                    points: 0
                }
            },
            {
                player: {
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 11,
                dice: 1
            },
            {
                total: 0,
                dice: 3,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 1,
                dice: 1,
                player: {
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 6,
                dice: 5,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 8,
                dice: 2,
                player: {
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 13,
                dice: 5,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 0,
                dice: 3,
                player: {
                    life: 1,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx',
                    points: 0
                }
            },
            {
                player: {
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 1,
                dice: 1
            },
            {
                total: 7,
                dice: 6,
                player: {
                    points: 0,
                    life: 1,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 8,
                dice: 1,
                player: {
                    life: 2,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                total: 9,
                dice: 1,
                player: {
                    points: 0,
                    life: 1,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 10,
                dice: 1,
                player: {
                    points: 0,
                    life: 2,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                }
            },
            {
                total: 14,
                dice: 4,
                player: {
                    username: 'xXx_David_xXx',
                    points: 0,
                    life: 1,
                    uid: 'TEST_UID2'
                }
            },
            {
                total: 0,
                dice: 3,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 1,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 2,
                dice: 2,
                player: {
                    points: 0,
                    life: 1,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 6,
                dice: 4,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 1,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 10,
                dice: 4,
                player: {
                    points: 0,
                    life: 1,
                    uid: 'TEST_UID2',
                    username: 'xXx_David_xXx'
                }
            },
            {
                total: 10,
                dice: 3,
                player: {
                    life: 1,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                total: 16,
                dice: 6,
                player: {
                    username: 'xXx_David_xXx',
                    points: 0,
                    life: 0,
                    uid: 'TEST_UID2'
                }
            }
        ],
        startedAt: {
            _seconds: 1571741119,
            _nanoseconds: 990000000
        },
        players: [
            {
                points: 0,
                life: 1,
                uid: 'TEST_UID',
                username: 'DrDreo'
            },
            {
                life: 0,
                uid: 'TEST_UID2',
                username: 'xXx_David_xXx',
                points: 0
            }
        ]
    },
    {
        startedAt: {
            _seconds: 1571741119,
            _nanoseconds: 990000000
        },
        finishedAt: {
            _seconds: 1571684785,
            _nanoseconds: 505000000
        },
        rolls: [
            {
                total: 0,
                dice: 3,
                player: {
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            },
            {
                total: 5,
                dice: 5,
                player: {
                    username: 'Hackl',
                    points: 0,
                    life: 6,
                    uid: null
                }
            },
            {
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID'
                },
                total: 9,
                dice: 4
            },
            {
                total: 9,
                dice: 3,
                player: {
                    life: 6,
                    uid: null,
                    username: 'Hackl',
                    points: 0
                }
            },
            {
                total: 15,
                dice: 6,
                player: {
                    username: 'DrDreo',
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID'
                }
            },
            {
                total: 19,
                dice: 4,
                player: {
                    points: 0,
                    life: 0,
                    uid: null,
                    username: 'Hackl'
                }
            }
        ],
        players: [
            {
                points: 0,
                life: 0,
                uid: null,
                username: 'Hackl'
            },
            {
                life: 6,
                uid: 'TEST_UID',
                username: 'DrDreo',
                points: 0
            }
        ]
    },
    {
        rolls: [
            {
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo'
                },
                total: 6,
                dice: 6
            },
            {
                total: 11,
                dice: 5,
                player: {
                    points: 0,
                    life: 6,
                    uid: 'TEST_UID3',
                    username: 'Hackl'
                }
            },
            {
                total: 17,
                dice: 6,
                player: {
                    life: 6,
                    uid: 'TEST_UID',
                    username: 'DrDreo',
                    points: 0
                }
            }
        ],
        startedAt: {
            _seconds: 1571684742,
            _nanoseconds: 461000000
        },
        players: [
            {
                points: 0,
                life: 0,
                uid: null,
                username: 'Hackl'
            },
            {
                username: 'DrDreo',
                points: 0,
                life: 4,
                uid: 'TEST_UID'
            }
        ],
        finishedAt: {
            _seconds: 1571684785,
            _nanoseconds: 505000000
        }
    }
];

describe('Player Statistics', () => {
    describe('extractPlayerStats', () => {
        it('should have rolledDice updated', () => {
            const { rolledDice } = extractPlayerStats('TEST_UID', games[0]);
            expect(rolledDice).toEqual([1, 1, 3, 1, 2, 1]);
        });

        it('should have won', () => {
            const { won } = extractPlayerStats('TEST_UID', games[0]);
            expect(won).toBe(true);
        });

        it('should calculate a perfectRoll', () => {
            const { perfectRoll } = extractPlayerStats('TEST_UID', games[4]);
            expect(perfectRoll).toBe(1);
        });

        it('should calculate a worstRoll', () => {
            const { worstRoll } = extractPlayerStats('TEST_UID2', games[3]);
            expect(worstRoll).toBe(1);
        });

        it('should calculate a luckiestRoll', () => {
            const { luckiestRoll } = extractPlayerStats('TEST_UID', games[0]);
            expect(luckiestRoll).toBe(1);
        });

        it('should calculate a rolled21', () => {
            const { rolled21 } = extractPlayerStats('TEST_UID3', games[0]);
            expect(rolled21).toBe(1);
        });

        it('should calculate a maxLifeLoss', () => {
            const { maxLifeLoss } = extractPlayerStats('TEST_UID', games[5]);
            expect(maxLifeLoss).toBe(1);
        });
    });
    describe('mergeStats', () => {
        it('should merge old and new stats together', () => {
            let oldStats = {
                rolled21: 0,
                perfectRoll: 1,
                worstRoll: 0,
                luckiestRoll: 0,
                rolledDice: [30, 21, 28, 22, 29, 29],
                totalGames: 18,
                wins: 6,
                maxLifeLoss: 1
            };

            const newStats = {
                rolledDice: [0, 0, 0, 1, 0, 1],
                won: true,
                perfectRoll: 1,
                luckiestRoll: 1,
                worstRoll: 1,
                rolled21: 1,
                maxLifeLoss: 1
            };

            oldStats = mergeStats(oldStats, newStats);

            expect(oldStats.worstRoll).toBe(1);
            expect(oldStats.perfectRoll).toBe(2);
            expect(oldStats.luckiestRoll).toBe(1);
            expect(oldStats.maxLifeLoss).toBe(2);
            expect(oldStats.rolled21).toBe(1);
            expect(oldStats.rolledDice[5]).toBe(30);
            expect(oldStats.wins).toBe(7);
        });

        it('should merge old and new stats together2', () => {
            let oldStats = {
                wins: 6,
                maxLifeLoss: 2,
                rolled21: 0,
                perfectRoll: 0,
                worstRoll: 0,
                luckiestRoll: 0,
                rolledDice: [30, 21, 28, 23, 29, 30],
                totalGames: 19
            };

            const newStats = {
                rolledDice: [0, 0, 0, 0, 1, 1],
                won: true,
                perfectRoll: 1,
                luckiestRoll: 0,
                worstRoll: 0,
                rolled21: 0,
                maxLifeLoss: 0
            };

            oldStats = mergeStats(oldStats, newStats);

            expect(oldStats.worstRoll).toBe(0);
            expect(oldStats.perfectRoll).toBe(1);
            expect(oldStats.luckiestRoll).toBe(0);
            expect(oldStats.maxLifeLoss).toBe(2);
            expect(oldStats.rolled21).toBe(0);
            expect(oldStats.rolledDice[5]).toBe(31);
            expect(oldStats.wins).toBe(7);
        });
    });
});
