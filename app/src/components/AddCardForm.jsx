import styled from 'styled-components';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { StyledInput } from './PartnerCol';

const StyledLabel = styled.label`
  font-weight: 500;
`;

const LeftAlignCol = styled(Col)`
  text-align: left;
`;

const RightAlignCol = styled(Col)`
  text-align: right;
`;

function AddCardForm({ onSubmit, error }) {
  return (
    <Container className='text-center'>
      <Row>
        <p>
          Feel free to add a card if you and your partner feel there is a task
          that the cards do not address. This may include childcare, eldercare,
          etc.
        </p>
      </Row>
      <form id='addCard' action='/' method='POST' onSubmit={onSubmit}>
        <Row className='justify-content-center align-items-center'>
          <RightAlignCol>
            <StyledLabel htmlFor='name'> Name*: </StyledLabel>
          </RightAlignCol>
          <LeftAlignCol>
            <StyledInput
              type='text'
              name='name'
              id='name'
              placeholder="Kid's school forms"
              align='left'
            />
          </LeftAlignCol>
        </Row>
        <Row className='justify-content-center align-items-center'>
          <RightAlignCol>
            <StyledLabel htmlFor='includes'> Description: </StyledLabel>
          </RightAlignCol>
          <LeftAlignCol>
            <StyledInput
              type='text'
              name='includes'
              id='includes'
              placeholder='completing, mailing'
              align='left'
            />
          </LeftAlignCol>
        </Row>
        <Row className='justify-content-center align-items-center'>
          <RightAlignCol>
            <StyledLabel htmlFor='name'>
              Is this task performed often and difficult to reschedule?*
            </StyledLabel>
          </RightAlignCol>
          <LeftAlignCol>
            <input
              type='radio'
              name='isDaily'
              id='isDaily'
              value='Y'
              style={{ accentColor: '#2d6a4f', margin: 4 }}
            />
            <label htmlFor='isDaily'>Yes</label>
            <input
              type='radio'
              name='isDaily'
              id='isNotDaily'
              value='NEVER'
              style={{ accentColor: '#2d6a4f', margin: 4 }}
            />
            <label htmlhtmlFor='isNotDaily'>No</label>
          </LeftAlignCol>
        </Row>
      </form>
      {error && (
        <Row
          className='justify-content-end align-items-center'
          style={{ textAlign: 'right', marginTop: 4, color: 'red' }}
        >
          Please make sure all fields have been properly filled.
        </Row>
      )}
    </Container>
  );
}
export default AddCardForm;
