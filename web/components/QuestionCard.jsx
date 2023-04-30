import { ActionIcon, Card, Group, Text } from "@mantine/core"
import styles from "@/styles/QuestionCard.module.css"
import { TbTrash } from "react-icons/tb"
import { useQuery } from "react-query"
import { fetchApi } from "@/modules/api"


export default function QuestionCard({ question, active, refetch, ...props }) {

    // query for deleting the question
    const { refetch: _deleteQuestion, isFetching: isDeleting } = useQuery({
        queryKey: ["deleteQuestion", question.id],
        queryFn: () => fetchApi("deleteQuestion", { questionId: question.id }),
        enabled: false,
        retry: false,
    })

    const deleteQuestion = e => {
        e.stopPropagation()
        _deleteQuestion().then(refetch)
    }

    return (
        <Card
            withBorder
            className={`${styles.card} ${active ? styles.active : ""}`}
            {...props}
        >
            <Group noWrap position="apart">
                <Text>
                    {question.question}
                </Text>
                <ActionIcon
                    onClick={deleteQuestion}
                    loading={isDeleting}
                    variant="subtle" color="red"
                >
                    <TbTrash />
                </ActionIcon>
            </Group>
        </Card>
    )
}
