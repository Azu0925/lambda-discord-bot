import { PublicKey } from "aws-cdk-lib/aws-cloudfront";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";

const verifyRequest = (event: APIGatewayProxyEventV2) => {
  const { headers, body } = event;
  const signature = headers["x-signature-ed25519"];
  const timestamp = headers["x-signature-timestamp"];
  const publicKey = process.env["DISCORD_PUBLIC_KEY"];
  if (!body || !signature || !timestamp || !publicKey) {
    return false;
  }
  return verifyKey(body, signature, timestamp, publicKey);
};

// interaction の処理
const handleInteraction = (interaction: Record<string, unknown>) => {
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const { data } = interaction as { data: Record<string, unknown> };
    if (data.name === "ping") {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "pong",
        },
      };
    }
  }

  return { type: InteractionResponseType.PONG };
};

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  if (!verifyRequest(event)) {
    return {
      statusCode: 401,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  const { body } = event;
  const interaction = JSON.parse(body!);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(handleInteraction(interaction)),
  };
};