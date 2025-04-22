import React, { FC, InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { Unbounded } from 'next/font/google';
import { Golos_Text } from 'next/font/google';

const unbounded = Unbounded({subsets: ["latin"]});
const golos = Golos_Text({subsets: ["latin"]});

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string | ReactNode;
  error?: string;
  hasError?: boolean;
  wrapperClassName?: string;
}

const Input: FC<InputProps> = ({
  label,
  suffix,
  error,
  hasError,
  disabled,
  className,
  wrapperClassName,
  ...props
}) => {
  // Вычисляем padding-right для инпута в зависимости от длины суффикса
  const getSuffixPadding = () => {
    if (!suffix) return '20px';
    if (typeof suffix === 'string') {
      return `${suffix.length * 15 + 12}px`;
    }
    return '40px';
  };

  return (
    <InputContainer className={wrapperClassName}>
      {label && <Label>{label}</Label>}
      <InputWrapper hasError={!!error || hasError} disabled={disabled}>
        <InputContentWrapper>
          <StyledInput
            disabled={disabled}
            className={className}
            style={{ paddingRight: getSuffixPadding() }}
            {...props}
          />
          {suffix && (
            <SuffixPosition>
              {suffix}
            </SuffixPosition>
          )}
        </InputContentWrapper>
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Label = styled.label`
  font-family: ${golos.style.fontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 150%;
  letter-spacing: -0.008em;
  color: var(--color-dark_grey);
  margin-bottom: 8px;
`;

interface InputWrapperProps {
  hasError?: boolean;
  disabled?: boolean;
}

const InputWrapper = styled.div<InputWrapperProps>`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #fff;
  border: 1px solid ${props => (props.hasError ? 'var(--color-alert)' : '#e0e0e0')};
  transition: all 0.2s ease;
  border-radius: 12px;
  &:focus-within {
    border-color: ${props => (props.hasError ? 'var(--color-alert)' : `var(--color-black)`)};
    box-shadow: ${props => (props.hasError ? '0 0 0 1px var(--color-alert)' : '0 0 0 1px var(--color-black)')};
  }

  ${props =>
    props.disabled &&
    `
    background-color: #f5f5f5;
    cursor: not-allowed;
  `}
`;

const InputContentWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  color: var(--color-black);
  font-family: ${unbounded.style.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 120%;
  padding: 16px 20px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #9e9e9e;
  }

  &:disabled {
    cursor: not-allowed;
    color: #9e9e9e;
  }
`;

const SuffixPosition = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-black);
  font-family: ${unbounded.style.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 120%;
`;

const ErrorMessage = styled.p`
  color: var(--color-alert);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  margin-bottom: 0;
`;

export default Input;
