const { Telegraf } = require('telegraf')
const { VM } = require('vm2')

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('text', async (ctx) => {
  const code = ctx.message.text.trim()

  try {
    const vm = new VM({
      timeout: 1000,
      sandbox: { console },
    })

    const result = vm.run(code)
    ctx.reply(`✅ Результат:\n\`\`\`js\n${String(result)}\n\`\`\``, {
      parse_mode: 'Markdown',
    })
  } catch (err) {
    ctx.reply(`❌ Ошибка:\n\`\`\`\n${err.message}\n\`\`\``, {
      parse_mode: 'Markdown',
    })
  }
})

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body, res)
    } catch (err) {
      console.error(err)
      res.status(500).send('Error')
    }
  } else {
    res.status(200).send('Eval Bot (Auto) is running!')
  }
}
