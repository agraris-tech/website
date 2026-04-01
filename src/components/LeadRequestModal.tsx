import { useEffect, useState } from 'react';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'callback' | 'product_offer';
    productTitle?: string;
};

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

    const isOffer = mode === 'product_offer';

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = 'hidden';

        setName('');
        setPhone('');
        setEmail('');
        setComment(
            isOffer && productTitle
                ? `Здравствуйте, интересует техника: ${productTitle}`
                : ''
        );

        return () => {
            document.body.style.overflow = '';
        };
    }, [open, isOffer, productTitle]);

    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onOpenChange(false);
        };

        if (open) window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [open, onOpenChange]);

    if (!open) return null;

    const handleSubmit = () => {
        const payload = {
            requestType: mode,
            name,
            phone,
            email,
            comment,
            productTitle,
            pageUrl: window.location.href,
        };

        console.log('SEND LEAD:', payload);
        onOpenChange(false);
    };

    return (
        <div
            onClick={() => onOpenChange(false)}
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
                onClick={(e) => e.stopPropagation()}
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
                    onClick={() => onOpenChange(false)}
                    style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: '#f3f4f6',
                        cursor: 'pointer',
                        fontSize: '20px',
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>

                <h2
                    style={{
                        margin: 0,
                        marginBottom: '10px',
                        fontSize: '28px',
                        fontWeight: 600,
                    }}
                >
                    {isOffer ? 'Запросить предложение' : 'Заказать звонок'}
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
                        <span style={{ color: '#6b7280' }}>Товар:</span>{' '}
                        <strong>{productTitle}</strong>
                    </div>
                )}

                <div style={{ display: 'grid', gap: '14px' }}>
                    <input
                        type="text"
                        placeholder="Ваше имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: '100%',
                            height: '48px',
                            borderRadius: '14px',
                            border: '1px solid #d1d5db',
                            padding: '0 14px',
                            fontSize: '15px',
                            boxSizing: 'border-box',
                        }}
                    />

                    <input
                        type="tel"
                        placeholder="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                            width: '100%',
                            height: '48px',
                            borderRadius: '14px',
                            border: '1px solid #d1d5db',
                            padding: '0 14px',
                            fontSize: '15px',
                            boxSizing: 'border-box',
                        }}
                    />

                    {isOffer && (
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                height: '48px',
                                borderRadius: '14px',
                                border: '1px solid #d1d5db',
                                padding: '0 14px',
                                fontSize: '15px',
                                boxSizing: 'border-box',
                            }}
                        />
                    )}

                    <textarea
                        placeholder="Комментарий"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
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

                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={{
                            width: '100%',
                            height: '50px',
                            borderRadius: '14px',
                            border: 'none',
                            background: '#15803d',
                            color: '#ffffff',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Отправить заявку
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
                </div>
            </div>
        </div>
    );
}