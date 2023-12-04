import * as React from 'react';
import styled from 'styled-components';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrow, faDove } from '@fortawesome/free-solid-svg-icons';
import CardHolder from './CardHolder';

export const StyledInput = styled.input`
  width: auto;
  border: none;
  border-bottom: #2d6a4f 1px solid;
  box-sizing: content-box;
  text-align: ${({ align = 'center' }) => align};
  background: none;

  &:focus {
    outline: none;
    border-bottom: #95d5b2 2px solid;
  }
`;

function PartnerCol({ placeholder, setName, children }) {
  return (
    <Container>
      <Row className='justify-content-center'>
        <FontAwesomeIcon
          size='lg'
          icon={placeholder === 'Partner 1 Name' ? faCrow : faDove}
        />
        <StyledInput
          type='text'
          placeholder={placeholder}
          onChange={(e) => setName(e.target.value)}
        />
      </Row>
      <Row>
        <CardHolder styled title={placeholder}>
          {children}
        </CardHolder>
      </Row>
    </Container>
  );
}

export default PartnerCol;
