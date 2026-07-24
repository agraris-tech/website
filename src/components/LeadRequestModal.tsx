import {
    FormEvent,
    MouseEvent,
    useEffect,
    useState,
} from 'react';

import { trackGoogleAdsLead } from '../lib/googleAdsLead';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'callback' | 'product_offer';
    productTitle?: string;
};

type LeadApiResponse = {
    success: boolean;
    leadId?: string;
    message?: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? '';

export function LeadRequestModal({
                                     open,
                                     onOpenChange,
                                     mode,
                                     productTitle,
                                 }: Props) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');

    // Скрытое антиспам-поле.
    const [website, setWebsite] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const isOffer = mode === 'product_offer';

    useEffect(() => {
        if (!open) {
            return;
        }

        document.body.style.overflow = 'hidden';

        setName('');
        setPhone('');
        setEmail('');
        setWebsite('');
        setErrorMessage('');
        setSuccessMessage('');
        setIsSubmitting(false);

        setComment(
            isOffer && productTitle
                ? `Здравствуйте, интересует техника: ${productTitle}`
                : '',
        );

        return () => {
            document.body.style.overflow = '';
        };
    }, [open, isOffer, productTitle]);

    useEffect(() => {
        const onEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isSubmitting) {
                onOpenChange(false);
            }
        };

        if (open) {
            window.addEventListener('keydown', onEsc);
        }

        return () => {
            window.removeEventListener('keydown', onEsc);
        };
    }, [open, isSubmitting, onOpenChange]);

    if (!open) {
        return null;
    }

    const closeModal = () => {
        if (!isSubmitting) {
            onOpenChange(false);
        }
    };

    const handleOverlayClick = () => {
        closeModal();
    };

    const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setErrorMessage('');
        setSuccessMessage('');

        const cleanName = name.trim();
        const cleanPhone = phone.trim();
        const cleanEmail = email.trim();
        const cleanComment = comment.trim();

        if (cleanName.length < 2) {
            setErrorMessage('Укажите ваше имя.');
            return;
        }

        if (!cleanPhone && !cleanEmail) {
            setErrorMessage('Укажите телефон или email.');
            return;
        }

        if (
            cleanEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            setErrorMessage('Проверьте правильность email.');
            return;
        }

        const payload = {
            requestType: mode,
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            comment: cleanComment,
            productTitle: productTitle?.trim() ?? '',
            pageUrl: window.location.href,

            // Если бот заполнит скрытое поле, сервер отклонит заявку.
            website,
        };

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            let result: LeadApiResponse;

            try {
                result = (await response.json()) as LeadApiResponse;
            } catch {
                throw new Error('Сервер вернул некорректный ответ.');
            }

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Не удалось отправить заявку.',
                );
            }

            if (result.leadId) {
                trackGoogleAdsLead(result.leadId);
            }

            setSuccessMessage(
                'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее рабочее время.',
            );

            setName('');
            setPhone('');
            setEmail('');
            setComment('');

            window.setTimeout(() => {
                onOpenChange(false);
            }, 1800);
        } catch (error) {
            console.error('Lead submission error:', error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Не удалось отправить заявку. Попробуйте ещё раз.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            onClick={handleOverlayClick}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999999,
                background: 'rgba(0, 0, 0, 0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
            }}
        >
            <div
                onClick={handleModalClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="lead-modal-title"
                style={{
                    width: '100%',
                    maxWidth: '560px',
                    background: '#ffffff',
                    borderRadius: '24px',
                    padding: '32px',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.35)',
                    position: 'relative',
                    color: '#111827',
                }}
            >
                <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    aria-label="Закрыть"
                    style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: '#f3f4f6',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontSize: '20px',
                        lineHeight: 1,
                        opacity: isSubmitting ? 0.6 : 1,
                    }}
                >
                    ×
                </button>

                <h2
                    id="lead-modal-title"
                    style={{
                        margin: 0,
                        marginBottom: '10px',
                        fontSize: '28px',
                        fontWeight: 600,
                    }}
                >
                    {isOffer
                        ? 'Запросить предложение'
                        : 'Заказать звонок'}
                </h2>

                <p
                    style={{
                        margin: 0,
                        marginBottom: '20px',
                        color: '#6b7280',
                        fontSize: '14px',
                        lineHeight: 1.5,
                    }}
                >
                    {isOffer
                        ? 'Оставьте контакты, и мы подготовим предложение по выбранной технике.'
                        : 'Оставьте контакты, и мы свяжемся с вами в ближайшее рабочее время.'}
                </p>

                {isOffer && productTitle && (
                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '12px 14px',
                            borderRadius: '14px',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            fontSize: '14px',
                        }}
                    >
                        <span style={{ color: '#6b7280' }}>
                            Товар:
                        </span>{' '}
                        <strong>{productTitle}</strong>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'grid',
                        gap: '14px',
                    }}
                >
                    <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        minLength={2}
                        placeholder="Ваше имя"
                        value={name}
                        disabled={isSubmitting}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        style={inputStyle}
                    />

                    <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        placeholder="Телефон"
                        value={phone}
                        disabled={isSubmitting}
                        onChange={(event) =>
                            setPhone(event.target.value)
                        }
                        style={inputStyle}
                    />

                    {isOffer && (
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="Email"
                            value={email}
                            disabled={isSubmitting}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            style={inputStyle}
                        />
                    )}

                    <textarea
                        name="comment"
                        placeholder="Комментарий"
                        rows={4}
                        value={comment}
                        disabled={isSubmitting}
                        onChange={(event) =>
                            setComment(event.target.value)
                        }
                        style={{
                            width: '100%',
                            borderRadius: '14px',
                            border: '1px solid #d1d5db',
                            padding: '14px',
                            fontSize: '15px',
                            boxSizing: 'border-box',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                        }}
                    />

                    {/* Honeypot: посетитель его не видит */}
                    <input
                        type="text"
                        name="website"
                        value={website}
                        onChange={(event) =>
                            setWebsite(event.target.value)
                        }
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            left: '-10000px',
                            width: '1px',
                            height: '1px',
                            opacity: 0,
                            pointerEvents: 'none',
                        }}
                    />

                    {errorMessage && (
                        <div
                            role="alert"
                            style={{
                                padding: '12px 14px',
                                borderRadius: '12px',
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#b91c1c',
                                fontSize: '14px',
                            }}
                        >
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div
                            role="status"
                            style={{
                                padding: '12px 14px',
                                borderRadius: '12px',
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                color: '#166534',
                                fontSize: '14px',
                            }}
                        >
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || Boolean(successMessage)}
                        style={{
                            width: '100%',
                            height: '50px',
                            borderRadius: '14px',
                            border: 'none',
                            background: '#15803d',
                            color: '#ffffff',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor:
                                isSubmitting || successMessage
                                    ? 'not-allowed'
                                    : 'pointer',
                            opacity:
                                isSubmitting || successMessage
                                    ? 0.7
                                    : 1,
                        }}
                    >
                        {isSubmitting
                            ? 'Отправляем…'
                            : successMessage
                                ? 'Заявка отправлена'
                                : 'Отправить заявку'}
                    </button>

                    <p
                        style={{
                            margin: 0,
                            textAlign: 'center',
                            color: '#6b7280',
                            fontSize: '12px',
                        }}
                    >
                        Ответим в рабочее время в течение 15–30 минут
                    </p>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    height: '48px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    padding: '0 14px',
    fontSize: '15px',
    boxSizing: 'border-box',
} as const;