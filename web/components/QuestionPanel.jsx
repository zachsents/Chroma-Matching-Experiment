import { fetchApi } from "@/modules/api"
import { ActionIcon, Box, Button, Card, Center, Checkbox, Divider, Group, Loader, NumberInput, SimpleGrid, Stack, Table, Text, Textarea, Title, Tooltip } from "@mantine/core"
import { useState } from "react"
import { TbTrash, TbX } from "react-icons/tb"
import { useQuery } from "react-query"


export default function QuestionPanel({ question }) {

    // state for text input
    const [answerText, setAnswerText] = useState("")

    // state for amount to generate
    const [amount, setAmount] = useState()

    // query for answers
    const { data: answers, isLoading: answersLoading, refetch: refetchAnswers } = useQuery({
        queryKey: ["answers", question.id],
        queryFn: () => fetchApi("listAnswers", undefined, { questionId: question.id }),
        refetchOnWindowFocus: false,
        // refetchInterval: 10000,
    })

    // query for submitting an answer
    const { refetch: _submitAnswer, isFetching: isSubmitting } = useQuery({
        queryKey: ["answerQuestion", question.id],
        queryFn: () => fetchApi("answerQuestion", { answer: answerText }, { questionId: question.id }),
        enabled: false,
        retry: false,
    })

    // submit an answer -- also clear answer text    
    const submitAnswer = (e) => {
        e.preventDefault()
        setAnswerText("")
        _submitAnswer().then(refetchAnswers)
    }

    // query for generating answers
    const { refetch: _generateAnswers, isFetching: isGenerating } = useQuery({
        queryKey: ["generateAnswers", question.id],
        queryFn: () => fetchApi("generateAnswers", { amount, questionId: question.id }),
        enabled: false,
        retry: false,
    })

    // generate answers -- don't clear number input
    const generateAnswers = (e) => {
        e.preventDefault()
        _generateAnswers().then(refetchAnswers)
    }

    // query for matching answers
    const { refetch: _matchAnswers, isFetching: isMatching } = useQuery({
        queryKey: ["matchAnswers", question.id],
        queryFn: () => fetchApi("matchAnswers", undefined, { questionId: question.id }),
        enabled: false,
        retry: false,
    })

    // match answers
    const matchAnswers = () => {
        _matchAnswers().then(refetchAnswers)
    }

    return (
        <Stack spacing="xl" p="xl">
            <Group position="apart">
                <Stack spacing="xs">
                    <Title order={3}>
                        {question.question}
                    </Title>
                    <Text color="dimmed" size="xs">{question.id}</Text>
                </Stack>
            </Group>

            <Group grow align="flex-start" spacing={50}>
                <Stack>
                    <Title order={5}>
                        Answer Manually
                    </Title>

                    <form onSubmit={submitAnswer}>
                        <Stack align="flex-start">
                            <Textarea
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="Type your answer"
                                w="100%"
                                maw={600}
                            />
                            <Button
                                type="submit"
                                loading={isSubmitting}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </form>
                </Stack>

                <Stack>
                    <Title order={5}>
                        Generate Answers
                    </Title>
                    <form onSubmit={generateAnswers}>
                        <Stack align="flex-start">
                            <NumberInput
                                value={amount}
                                onChange={setAmount}
                                placeholder="How many"
                            />
                            <Button type="submit" loading={isGenerating}>
                                Generate
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Group>

            <Divider />
            <Title order={5}>
                Answers
            </Title>

            <Box>
                <Button onClick={matchAnswers} loading={isMatching}>
                    Match Answers
                </Button>
            </Box>

            {answersLoading ?
                <Center>
                    <Loader />
                </Center> :
                answers?.length ?
                    <Table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>ID</th>
                                <th>Answer</th>
                                <th>Match</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {answers.map(answer =>
                                <AnswerRow
                                    answer={answer}
                                    questionId={question.id}
                                    refetch={refetchAnswers}
                                    key={answer.id}
                                />
                            )}
                        </tbody>
                    </Table> :
                    <Text align="center" color="dimmed">No answers yet</Text>}
        </Stack>
    )
}


function AnswerRow({ answer, questionId, refetch }) {

    // query for deleting an answer
    const { refetch: _deleteAnswer, isFetching: isDeleting } = useQuery({
        queryKey: ["deleteAnswer", questionId, answer.id],
        queryFn: () => fetchApi("deleteAnswer", { answerId: answer.id }, { questionId }),
        enabled: false,
        retry: false,
    })

    // delete an answer
    const deleteAnswer = () => {
        _deleteAnswer().then(refetch)
    }

    return (
        <tr>
            <td>{new Date(answer.timestamp).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
            })}</td>
            <td>{answer.id}</td>
            <td>{answer.text}</td>
            <td>{answer.match}</td>
            <td>
                <Group>
                    <Tooltip label="Delete Answer">
                        <ActionIcon
                            onClick={deleteAnswer}
                            color="red" variant="subtle"
                            loading={isDeleting}
                        >
                            <TbX />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </td>
        </tr>
    )
}