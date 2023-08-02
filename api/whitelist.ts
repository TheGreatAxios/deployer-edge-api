export const config = {
    runtime: "edge"
}

export default(req) => {
    return new Response("Hello World");
}