import * as React from 'react';
import styled from 'styled-components';

const StyledBtn = styled.button`
  background: #52b788;
  border-radius: 18px;
  color: white;
  display: inline-block;
  margin: 0.5rem 1rem;
  padding: 8px 8px;
  border: none;
  transition: all 200ms ease-in-out;
  width: auto;
  font-weight: 500;
  margin-bottom: 24px;

  &:hover {
    filter: brightness(0.85);
  }

  &:active {
    filter: brightness(1);
  }
`;

function Button(props) {
  return (
    <StyledBtn onClick={props.onClick} style={props.style} {...props}>
      {props.title}
    </StyledBtn>
  );
}

export default Button;
