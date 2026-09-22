export default {
  async fetch(request, env) {

    if (request.method === "POST") {

      const { prompt } = await request.json();

      const response = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          prompt: prompt
        }
      );

      return Response.json(response);
    }

    return new Response("Hello from Worker");
  }
};