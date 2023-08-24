export type User = {
    _id: {
        $oid: string
    }
    email: {
        address: string
    }
    new_email: {
        address?: string
    }
    username: string
    name?: string
    about?: string
    img?: string
    link?: string
    recovery_token?: string
    created_on: number
    updated_on: number
}

export type Question = {
    _id: {
        $oid: string
    }
    title: string
    options: {
        _id: {
            $oid: string
        }
        body: string
        is_correct: boolean
        pick_rate: number
    }[]
}

export type Response = {
    _id: {
        $oid: string
    }
    user?: {
        _id: {
            $oid: string
        }
        username: string
        img?: string
    }
    answers: {
        question_id: string
        choice_id: string
    }[]
    correctness: number
    elapsed_time?: number
    created_on: number
}

export type QuizBrief = {
    _id: {
        $oid: string
    }
    title: string
    description: string
    tags: string[]
    user?: {
        _id: {
            $oid: string
        }
        username: string
        img?: string
    }
    questions: number
    responses: number
    comments: number
    liked_users: number
    disliked_users: number
    created_on: number
    updated_on: number
}

export type Quiz = {
    _id: {
        $oid: string
    }
    questions: number
    responses: number
    comments: {
        _id: {
            $oid: string
        }
        user: {
            _id: {
                $oid: string
            }
            username: string
            img?: string
        }
        body: string
        liked_users: {
            $oid: string
        }[]
        disliked_users: {
            $oid: string
        }[]
        created_on: number
        updated_on: number
    }[]
    time_limit?: number
    user?: {
        _id: {
            $oid: string
        }
        username: string
        img?: string
    }
    liked_users: {
        $oid: string
    }[]
    disliked_users: {
        $oid: string
    }[]
    blocked_users: {
        $oid: string
    }[]
    is_response_submitted?: boolean
    tags: string[]
    title: string
    description: string
    created_on: number
    updated_on: number
}

export type QuizWithResponses = {
    _id: {
        $oid: string
    }
    title: string
    questions: Question[]
    responses: Response[]
    time_limit?: number
    created_on: number
    updated_on: number
    correctness_of_responses?: {
        _id: {
            $oid: string
        },
        user?: {
            _id: {
                $oid: string
            }
            username: string
            img?: string
        }
        correctness: number
    }[]
}

export type QuizWithQuestions = {
    _id: {
        $oid: string
    }
    questions: Question[]
    time_limit?: number
    created_on: number
    updated_on: number
}
