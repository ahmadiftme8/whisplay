import React from "react";
import styled from "styled-components";

// Windows 95 style slider implementation
const StyledSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 20px;
  background: transparent;
  outline: none;
  margin: 10px 0;

  /* WEBGEKIT (Chrome, Safari, Edge) */
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: #000;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
    box-shadow: inset 1px 1px 0 #808080;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 22px;
    width: 12px;
    background: #c0c0c0;
    cursor: pointer;
    margin-top: -10px; /* Centers thumb on the track */
    box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #000, 1px 1px 0 #000;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    border-right: 1px solid #808080;
    border-bottom: 1px solid #808080;
  }

  /* FIREFOX */
  &::-moz-range-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: #000;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
    box-shadow: inset 1px 1px 0 #808080;
  }

  &::-moz-range-thumb {
    height: 22px;
    width: 12px;
    background: #c0c0c0;
    cursor: pointer;
    border: none;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    border-right: 1px solid #808080;
    border-bottom: 1px solid #808080;
    box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #000, 1px 1px 0 #000;
  }

  &:focus::-webkit-slider-thumb {
    background: #c0c0c0;
  }
`;

interface FaderProps {
  value: number; // 0-100
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string; // react95 components might accept className
}

export const Fader: React.FC<FaderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  className,
}) => {
  return (
    <div className={className} style={{ width: '100%', padding: '0 5px', display: 'flex', alignItems: 'center' }}>
      <StyledSlider
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};
