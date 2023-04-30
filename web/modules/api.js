
export function fetchApi(endpoint, body, params = {}) {

    const queryString = new URLSearchParams(params).toString()

    return fetch(`/api/${endpoint}?${queryString}`, {
        method: body ? "POST" : "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: body && JSON.stringify(body),
    }).then(res => res.json())
}