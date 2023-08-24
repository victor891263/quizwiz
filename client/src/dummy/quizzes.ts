import {Quiz, QuizBrief, QuizWithResponses} from "../types"

export const quizzes: QuizBrief[] = [
    {
        _id: {
            $oid: 'sd9f6'
        },
        title: 'The one and only socialism quiz',
        description: 'Socialism is a political philosophy and movement encompassing a wide range of economic and social systems which are characterised by social ownership of the means of production, as opposed to private ownership. As a term, it describes the economic, political, and social theories and movements associated with the implementation of such systems.',
        tags: ['sociology', 'philosophy', 'economics', 'politics'],
        user: {
            _id: {
                $oid: '98as7'
            },
            username: 'redfash674'
        },
        questions: 10,
        responses: 56,
        comments: 11,
        liked_users: 47,
        disliked_users: 3,
        created_on: new Date(2023, 7, 17).getTime(),
        updated_on: new Date(2023, 7, 18).getTime()
    },
    {
        _id: {
            $oid: 'df89g'
        },
        title: 'Do you have the knowledge it takes to be a true American patriot?',
        description: 'America, the current world hegemon, in terms of economics, politics, technology, and cultural influence, is founded upon many noble ideals.',
        tags: ['politics', 'USA', 'history'],
        user: {
            _id: {
                $oid: '7asd8'
            },
            username: 'ancapistan23'
        },
        questions: 8,
        responses: 34,
        comments: 7,
        liked_users: 4,
        disliked_users: 21,
        created_on: new Date(2023, 7, 11).getTime(),
        updated_on: new Date(2023, 7, 13).getTime()
    }
]

export const longQuizzes: Quiz[] = [
    {
        _id: {
            $oid: 'sd9f6'
        },
        questions: 2,
        responses: 2,
        comments: [
            {
                _id: {
                    $oid: 'f9g87g'
                },
                user: {
                    _id: {
                        $oid: 's98df6'
                    },
                    username: 'anarcho-owl2321'
                },
                body: 'Businesses are not fucking over people. My dad runs a business and you have to understand that his expenses have gone through the fucking roof. You wanna see his gas bill oh Jesus Christ.',
                liked_users: [
                    {
                        $oid: '6u7oiz'
                    }
                ],
                disliked_users: [],
                created_on: new Date(2023, 7, 19).getTime(),
                updated_on: new Date(2023, 7, 19).getTime()
            },
            {
                _id: {
                    $oid: 'd7fg98'
                },
                user: {
                    _id: {
                        $oid: 'b8n7mn'
                    },
                    username: 'Socialfascist.GPT'
                },
                body: `No, social democracy isn't a road to communism. It's a worker's party which in Marxist revisionist's view was meant to further the transition to "socialism" and to improve the lives of the working class.`,
                liked_users: [],
                disliked_users: [],
                created_on: new Date(2023, 7, 20).getTime(),
                updated_on: new Date(2023, 7, 20).getTime()
            }
        ],
        time_limit: 30,
        user: {
            _id: {
                $oid: '98as7'
            },
            username: 'redfash674'
        },
        liked_users: [
            {
                $oid: '6u7oiz'
            }
        ],
        disliked_users: [
            {
                $oid: '9a8sd6'
            },
            {
                $oid: '8d9fg7'
            }
        ],
        blocked_users: [],
        is_response_submitted: true,
        tags: ['politics', 'USA', 'history'],
        title: 'The one and only socialism quiz',
        description: `Socialism is a political philosophy and movement encompassing a wide range of economic and social systems which are characterised by social ownership of the means of production, as opposed to private ownership. As a term, it describes the economic, political, and social theories and movements associated with the implementation of such systems.`,
        created_on: new Date(2023, 7, 11).getTime(),
        updated_on: new Date(2023, 7, 13).getTime()
    }
]

export const quizWithResponses: QuizWithResponses = {
    _id: {
        $oid: 'sd9f6'
    },
    title: 'The one and only socialism quiz',
    questions: [
        {
            _id: {
                $oid: 'd89fg7'
            },
            title: `People's behaviors will more often change according to their socioeconomic conditions than according to which ideas they consider superior.`,
            options: [
                {
                    _id: {
                        $oid: 'r0t7y'
                    },
                    body: 'Yes',
                    is_correct: true,
                    pick_rate: 50
                },
                {
                    _id: {
                        $oid: 'v8n7h'
                    },
                    body: 'No',
                    is_correct: false,
                    pick_rate: 50
                },
                {
                    _id: {
                        $oid: 'cx78v6'
                    },
                    body: 'Both of them cause a roughly equal amount of change',
                    is_correct: false,
                    pick_rate: 50
                }
            ],
        },
        {
            _id: {
                $oid: 'yt897'
            },
            title: `Human labor is what transforms the already-existing objects of nature by adding new utility.`,
            options: [
                {
                    _id: {
                        $oid: 'f9g6h'
                    },
                    body: 'Yes',
                    is_correct: true,
                    pick_rate: 50
                },
                {
                    _id: {
                        $oid: '0jkl7'
                    },
                    body: 'No',
                    is_correct: false,
                    pick_rate: 50
                }
            ],
        }
    ],
    responses: [
        {
            _id: {
                $oid: '0d9f8g7d'
            },
            user: {
                _id: {
                    $oid: 's98df6'
                },
                username: 'anarcho-owl2321'
            },
            answers: [
                {
                    question_id: 'd89fg7',
                    choice_id: 'cx78v6'
                },
                {
                    question_id: 'yt897',
                    choice_id: 'f9g6h'
                }
            ],
            correctness: 50,
            elapsed_time: 15,
            created_on: new Date(2023, 7, 19).getTime()
        },
        {
            _id: {
                $oid: 'c9vb6cbv'
            },
            user: {
                _id: {
                    $oid: 'c98b6v'
                },
                username: 'milfhunter'
            },
            answers: [
                {
                    question_id: 'd89fg7',
                    choice_id: 'v8n7h'
                },
                {
                    question_id: 'yt897',
                    choice_id: '0jkl7'
                }
            ],
            correctness: 50,
            elapsed_time: 9,
            created_on: new Date(2023, 7, 20).getTime()
        }
    ],
    correctness_of_responses: [
        {
            _id: {
                $oid: 'c9vb6cbv'
            },
            user: {
                _id: {
                    $oid: 'c98b6v'
                },
                username: 'milfhunter'
            },
            correctness: 50
        },
        {
            _id: {
                $oid: '0d9f8g7d'
            },
            user: {
                _id: {
                    $oid: 's98df6'
                },
                username: 'anarcho-owl2321'
            },
            correctness: 50
        }
    ],
    time_limit: 30,
    created_on: new Date(2023, 7, 11).getTime(),
    updated_on: new Date(2023, 7, 13).getTime()
}

