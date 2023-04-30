import { QueryClient, QueryClientProvider } from "react-query"
import { MantineProvider } from "@mantine/core"
import "global.css"

const queryClient = new QueryClient()


export default function App({ Component, pageProps }) {
    return <QueryClientProvider client={queryClient}>
        <MantineProvider withCSSVariables>
            <Component {...pageProps} />
        </MantineProvider>
    </QueryClientProvider>
}
