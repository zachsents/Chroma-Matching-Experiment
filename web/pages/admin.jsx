import QuestionCard from "@/components/QuestionCard"
import QuestionPanel from "@/components/QuestionPanel"
import { fetchApi } from "@/modules/api"
import { Button, Center, Group, Loader, ScrollArea, Stack, Text, TextInput } from "@mantine/core"
import { useEffect } from "react"
import { useState } from "react"
import { useQuery } from "react-query"


export default function Admin() {

    // state for text input
    const [questionText, setQuestionText] = useState("")

    // state for selected question
    const [selectedQuestion, setSelectedQuestion] = useState()

    // query for questions
    const { data: questions, isLoading: questionsLoading, refetch: refetchQuestions } = useQuery({
        queryKey: "questions",
        queryFn: () => fetchApi("listQuestions"),
        refetchOnWindowFocus: false,
        // refetchInterval: 10000,
    })

    // side-effect: deselect if selected question doesn't exist
    useEffect(() => {
        if (selectedQuestion && !questions?.find(q => q.id == selectedQuestion.id))
            setSelectedQuestion(null)
    }, [questions, selectedQuestion])

    // query for submitting a question
    const { refetch: _submitQuestion, isFetching: isSubmitting } = useQuery({
        queryKey: "askQuestion",
        queryFn: () => fetchApi("askQuestion", { question: questionText }),
        enabled: false,
        retry: false,
    })

    // submit a question -- also clear question text    
    const submitQuestion = (e) => {
        e.preventDefault()
        setQuestionText("")
        _submitQuestion().then(refetchQuestions)
    }

    return (
        <Group h="100vh" spacing={0}>
            <ScrollArea h="100%" bg="gray.1">
                <Stack w={250} p="xs">

                    <form onSubmit={submitQuestion}>
                        <Stack>
                            <TextInput
                                value={questionText}
                                onChange={e => setQuestionText(e.target.value)}
                                placeholder="Ask a question"
                                name="question"
                            />
                            <Button
                                type="submit"
                                loading={isSubmitting}
                            >
                                Submit
                            </Button>
                        </Stack>
                    </form>

                    {questionsLoading ?
                        <Center>
                            <Loader />
                        </Center> :
                        questions.length ?
                            <>
                                {questions.map(question => {
                                    const active = selectedQuestion?.id == question.id
                                    return <QuestionCard
                                        question={question}
                                        active={active}
                                        onClick={() => setSelectedQuestion(active ? null : question)}
                                        refetch={refetchQuestions}
                                        key={question.id}
                                    />
                                })}
                            </> :
                            <Text align="center" color="dimmed">No questions yet</Text>}
                </Stack>
            </ScrollArea>

            <ScrollArea h="100%" sx={{ flexGrow: 1 }}>
                {selectedQuestion &&
                    <QuestionPanel
                        question={selectedQuestion}
                        key={selectedQuestion.id}
                    />}
            </ScrollArea>
        </Group>
    )
}


