const commands = {
    name: "ping", // コマンド
    type: 1, // CHAT_INPUT
    description: "Lambda で実装したコマンド", // コマンドの説明
  }

const res = await fetch(
  `https://discord.com/api/v10/applications/${process.env["APPLICATION_ID"]}/commands`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bot ${process.env["DISCORD_TOKEN"]}`,
    },
    body: JSON.stringify(commands),
  }
);

  console.log(res)