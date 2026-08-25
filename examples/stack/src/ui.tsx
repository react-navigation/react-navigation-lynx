import type { ReactNode } from '@lynx-js/react';

export const colors = {
  background: '#f2f2f7',
  card: '#ffffff',
  border: '#d1d1d6',
  text: '#1c1c1e',
  muted: '#6c6c70',
  accent: '#2050ff',
  danger: '#d7263d',
};

export function Screen({
  title,
  subtitle,
  background = colors.background,
  children,
}: {
  title: string;
  subtitle?: string;
  background?: string;
  children?: ReactNode;
}) {
  return (
    <view
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '20px',
        backgroundColor: background,
      }}
    >
      <text
        style={{ fontSize: '24px', fontWeight: '700', color: colors.text }}
      >
        {title}
      </text>
      {subtitle ? (
        <text
          style={{
            fontSize: '14px',
            color: colors.muted,
            marginTop: '6px',
            marginBottom: '10px',
          }}
        >
          {subtitle}
        </text>
      ) : null}
      {children}
    </view>
  );
}

export function Button({
  label,
  onTap,
  tone = 'accent',
}: {
  label: string;
  onTap: () => void;
  tone?: 'accent' | 'danger' | 'plain';
}) {
  const backgroundColor =
    tone === 'accent'
      ? colors.accent
      : tone === 'danger'
        ? colors.danger
        : colors.card;

  return (
    <view
      style={{
        height: '44px',
        marginTop: '8px',
        borderRadius: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor,
      }}
      bindtap={onTap}
    >
      <text
        style={{
          fontSize: '15px',
          color: tone === 'plain' ? colors.text : '#ffffff',
        }}
      >
        {label}
      </text>
    </view>
  );
}

/** A small key/value readout, for showing navigation state in the demos. */
export function Readout({ lines }: { lines: string[] }) {
  return (
    <view
      style={{
        marginTop: '12px',
        padding: '12px',
        borderRadius: '10px',
        backgroundColor: colors.card,
      }}
    >
      {lines.map((line, index) => (
        <text
          key={`${index}-${line}`}
          style={{
            fontSize: '13px',
            color: colors.muted,
            marginTop: index === 0 ? '0px' : '4px',
          }}
        >
          {line}
        </text>
      ))}
    </view>
  );
}
