import { cn } from '../lib/utils.js';

// Bordered surface. With spotlight on, a soft green light follows the pointer.
export default function Card({ as: Tag = 'div', spotlight = true, className, children, ...props }) {
  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <Tag
      className={cn('card', spotlight && 'card-spot', className)}
      onPointerMove={spotlight ? onPointerMove : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
