// src/components/AutoResizingTextarea.jsx
import React, { useRef, useLayoutEffect } from 'react';

export default function AutoResizingTextarea({ value, onChange, placeholder, className }) {
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} overflow-hidden resize-none min-h-[100px]`}
      rows={1}
    />
  );
}