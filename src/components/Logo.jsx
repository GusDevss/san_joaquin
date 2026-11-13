import stack from '../assets/logo-stack.svg?raw';
import horizontal from '../assets/logo-h.svg?raw';

export default function Logo({ variant = 'h', className = '' }) {
  return (
    <span
      className={`logo logo--${variant} ${className}`}
      dangerouslySetInnerHTML={{ __html: variant === 'stack' ? stack : horizontal }}
    />
  );
}
