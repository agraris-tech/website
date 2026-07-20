import { Resend } from 'resend';

type LeadRequest = {
    requestType?: unknown;
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    comment?: unknown;
    productTitle?: unknown;
    pageUrl?: unknown;
    website?: unknown;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    leadId?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

function jsonResponse(
    data: ApiResponse,
    status = 200,
): Response {
    return Response.json(data, {
        status,
        headers: {
            'Cache-Control': 'no-store',
        },
    });
}

function getString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

export default {
    async fetch(request: Request): Promise<Response> {
        if (request.method !== 'POST') {
            return jsonResponse(
                {
                    success: false,
                    message: 'Метод не поддерживается.',
                },
                405,
            );
        }

        try {
            if (
                !process.env.RESEND_API_KEY ||
                !process.env.LEAD_TO_EMAIL ||
                !process.env.MAIL_FROM
            ) {
                console.error(
                    'Missing RESEND_API_KEY, LEAD_TO_EMAIL or MAIL_FROM',
                );

                return jsonResponse(
                    {
                        success: false,
                        message: 'Сервис отправки писем не настроен.',
                    },
                    500,
                );
            }

            const body = (await request.json()) as LeadRequest;

            const requestType = getString(body.requestType);
            const name = getString(body.name);
            const phone = getString(body.phone);
            const email = getString(body.email);
            const comment = getString(body.comment);
            const productTitle = getString(body.productTitle);
            const pageUrl = getString(body.pageUrl);
            const website = getString(body.website);

            /*
             * Honeypot.
             * Обычный пользователь это поле не видит.
             * Боту возвращаем формально успешный ответ,
             * но письмо и Google-конверсию не создаём.
             */
            if (website) {
                return jsonResponse({
                    success: true,
                });
            }

            if (name.length < 2 || name.length > 100) {
                return jsonResponse(
                    {
                        success: false,
                        message: 'Проверьте имя.',
                    },
                    400,
                );
            }

            if (!phone && !email) {
                return jsonResponse(
                    {
                        success: false,
                        message: 'Укажите телефон или email.',
                    },
                    400,
                );
            }

            if (phone.length > 50) {
                return jsonResponse(
                    {
                        success: false,
                        message: 'Проверьте номер телефона.',
                    },
                    400,
                );
            }

            if (email && !isValidEmail(email)) {
                return jsonResponse(
                    {
                        success: false,
                        message: 'Проверьте email.',
                    },
                    400,
                );
            }

            if (
                comment.length > 3000 ||
                productTitle.length > 500 ||
                pageUrl.length > 2000
            ) {
                return jsonResponse(
                    {
                        success: false,
                        message: 'Слишком длинные данные формы.',
                    },
                    400,
                );
            }

            const leadId = crypto.randomUUID();

            const requestTypeTitle =
                requestType === 'product_offer'
                    ? 'Запрос предложения'
                    : 'Заказ обратного звонка';

            const subject =
                requestType === 'product_offer' && productTitle
                    ? `${requestTypeTitle}: ${productTitle}`
                    : `${requestTypeTitle} — Agraris Teknik`;

            const createdAt = new Date().toLocaleString('ru-RU', {
                timeZone: 'Europe/Minsk',
            });

            const text = [
                'Новая заявка Agraris Teknik',
                '',
                `ID заявки: ${leadId}`,
                `Тип заявки: ${requestTypeTitle}`,
                `Имя: ${name}`,
                `Телефон: ${phone || 'Не указан'}`,
                `Email: ${email || 'Не указан'}`,
                `Техника: ${productTitle || 'Не указана'}`,
                `Комментарий: ${comment || 'Не указан'}`,
                `Страница: ${pageUrl || 'Не указана'}`,
                `Дата: ${createdAt}`,
            ].join('\n');

            const html = `
                <div style="
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #111827;
                    max-width: 680px;
                ">
                    <h2 style="margin: 0 0 20px;">
                        Новая заявка Agraris Teknik
                    </h2>

                    <table
                        cellpadding="8"
                        cellspacing="0"
                        style="
                            width: 100%;
                            border-collapse: collapse;
                            border: 1px solid #e5e7eb;
                        "
                    >
                        <tr>
                            <td style="border:1px solid #e5e7eb;">
                                <strong>ID заявки</strong>
                            </td>
                            <td style="border:1px solid #e5e7eb;">
                                ${escapeHtml(leadId)}
                            </td>
                        </tr>

                        <tr>
                            <td style="border:1px solid #e5e7eb;">
                                <strong>Тип заявки</strong>
                            </td>
                            <td style="border:1px solid #e5e7eb;">
                                ${escapeHtml(requestTypeTitle)}
                            </td>
                        </tr>

                        <tr>
                            <td style="border:1px solid #e5e7eb;">
                                <strong>Имя</strong>
                            </td>
                            <td style="border:1px solid #e5e7eb;">
                                ${escapeHtml(name)}
                            </td>
                        </tr>

                        <tr>
                            <td style="border:1px solid #e5e7eb;">
                                <strong>Телефон</strong>
                            </td>
                            <td style="border:1px solid #e5e7eb;">
                                ${escapeHtml(phone || 'Не указан')}
                            </td>
                        </tr>

                        <tr>
                            <td style="border:1px solid #e5e7eb;">
                                <strong>Email</strong>
                            </td>
                            <td style="border:1px solid #e5e7eb;">
                                ${escapeHtml(email || 'Не указан')}
                            </td>
                        </tr>

                        <tr>
                            <td style="border:1px solid #e5e7eb;">
                                <strong>Техника</strong>
                            </td>
                            <td style="border:1px solid #e5e7eb;">
                                ${escapeHtml(productTitle || 'Не указана')}
                            </td>
                        </tr>

                        <tr>
                            <td style="border:1px solid #e5e7eb;">
                                <strong>Комментарий</strong>
                            </td>
                            <td style="border:1px solid #e5e7eb;">
                                ${escapeHtml(comment || 'Не указан')
                .replaceAll('\n', '<br>')}
                            </td>
                        </tr>

                        <tr>
                            <td style="border:1px solid #e5e7eb;">
                                <strong>Страница</strong>
                            </td>
                            <td style="border:1px solid #e5e7eb;">
                                ${
                pageUrl
                    ? `<a href="${escapeHtml(pageUrl)}">
                                            ${escapeHtml(pageUrl)}
                                           </a>`
                    : 'Не указана'
            }
                            </td>
                        </tr>

                        <tr>
                            <td style="border:1px solid #e5e7eb;">
                                <strong>Дата</strong>
                            </td>
                            <td style="border:1px solid #e5e7eb;">
                                ${escapeHtml(createdAt)}
                            </td>
                        </tr>
                    </table>
                </div>
            `;

            const { data, error } = await resend.emails.send({
                from: process.env.MAIL_FROM,
                to: [process.env.LEAD_TO_EMAIL],
                replyTo: email || undefined,
                subject,
                text,
                html,
                tags: [
                    {
                        name: 'lead_id',
                        value: leadId,
                    },
                    {
                        name: 'request_type',
                        value:
                            requestType === 'product_offer'
                                ? 'product_offer'
                                : 'callback',
                    },
                ],
            });

            if (error) {
                console.error('Resend error:', error);

                return jsonResponse(
                    {
                        success: false,
                        message:
                            'Не удалось отправить заявку. Позвоните нам или повторите попытку.',
                    },
                    500,
                );
            }

            console.log('Lead email sent:', {
                leadId,
                emailId: data?.id,
            });

            return jsonResponse(
                {
                    success: true,
                    leadId,
                },
                201,
            );
        } catch (error) {
            console.error('Lead API error:', error);

            return jsonResponse(
                {
                    success: false,
                    message:
                        'Произошла ошибка при отправке заявки.',
                },
                500,
            );
        }
    },
};