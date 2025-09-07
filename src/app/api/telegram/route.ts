import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, contactMethods, additionalInfo } = body;


    // Получаем переменные окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;


    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: 'Telegram bot configuration is missing' },
        { status: 500 }
      );
    }

    // Формируем сообщение
    const contactMethodsText = Array.isArray(contactMethods) 
      ? contactMethods.join(', ') 
      : contactMethods || 'Не указано';

    const message = `
🥊 *Новая заявка с сайта JAB Martial Arts*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
💬 *Предпочитаемые способы связи:* ${contactMethodsText}
📝 *Дополнительная информация:* ${additionalInfo || 'Не указано'}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
    `;

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      return NextResponse.json(
        { error: 'Failed to send message to Telegram', details: errorData },
        { status: 500 }
      );
    }

    const telegramData = await telegramResponse.json();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
