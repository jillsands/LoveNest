import React, { useState } from 'react';
import styled from 'styled-components';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Button from './components/Button';
import TaskCard from './components/TaskCard';
import PartnerCol, { StyledInput } from './components/PartnerCol';
import CardHolder from './components/CardHolder';
import Modal from './components/Modal';

import { COLUMN_NAMES, DIRECTIONS } from './constants';
import { tasks } from './tasks';

const StyledHeader = styled.div`
  color: #1b4332;
  font-size: 32px;
  margin: 24px;
  margin-top: 48px;
  font-weight: 600;
`;

function Home() {
  const [directionsOpen, setDirectionsOpen] = useState(true);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [addCardErr, setAddCardErr] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const [inRound1, setInRound1] = useState(true);
  const [partner1Name, setpartner1Name] = useState('');
  const [partner2Name, setpartner2Name] = useState('');

  const [items, setItems] = useState(tasks);

  const { PRTNR_1, UNSORTED, PRTNR_2 } = COLUMN_NAMES;

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];

    if (dragItem) {
      setItems((prevState) => {
        const coppiedStateArray = [...prevState];

        // remove item by "hoverIndex" and put "dragItem" instead
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);

        // remove item by "dragIndex" and put "prevItem" instead
        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);

        return coppiedStateArray;
      });
    }
  };

  const returnItemsForColumn = (columnName) => {
    return items
      .filter((item) => item.column === columnName)
      .map((item, index) => (
        <TaskCard
          key={index}
          item={item}
          setItems={setItems}
          index={index}
          moveCardHandler={moveCardHandler}
        />
      ));
  };

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const time = e.target[1].value;
    let dailyGrind = e.target[2].value;

    console.log({ name, time, dailyGrind });

    if (name && time && dailyGrind) {
      dailyGrind = e.target[2].value === 'Y' ? true : false;
      items.push({ name, column: UNSORTED });
      setAddCardOpen(false);
      setAddCardErr(false);
      return;
    }
    setAddCardErr(true);
  };

  return (
    <div className='Home'>
      <DndProvider backend={HTML5Backend}>
        <Container>
          <Row className='justify-content-md-center'>
            <StyledHeader> The Love Nest </StyledHeader>
            <Button
              title='Directions'
              onClick={() => setDirectionsOpen(true)}
              style={{ position: 'absolute', top: 4, right: 4 }}
            />
          </Row>
          <Row>
            <Col xs={{ span: 12, order: 2 }} sm={{ span: 4, order: 1 }}>
              <PartnerCol placeholder={PRTNR_1} setName={setpartner1Name}>
                {returnItemsForColumn(PRTNR_1).length > 0
                  ? returnItemsForColumn(PRTNR_1)
                  : 'Drag Cards Here!'}
              </PartnerCol>
            </Col>
            <Col
              className='justify-content-md-center'
              xs={{ span: 12, order: 1 }}
              sm={{ span: 4, order: 2 }}
            >
              <Row className='justify-content-md-center mt-3'>
                <h3> Cards </h3>
              </Row>
              <CardHolder title={UNSORTED}>
                {returnItemsForColumn(UNSORTED).length > 0 ? (
                  returnItemsForColumn(UNSORTED)
                ) : inRound1 ? (
                  <>
                    You've sorted all the cards!
                    <Button
                      title='Next Step'
                      onClick={() => setAnalysisOpen(true)}
                    />
                  </>
                ) : (
                  <>
                    Happy with your sort? <br />
                    Try out your current selection for a week, then give each
                    other feedback. Task ownership can- and should, in the more
                    demanding cases- be changed from week to week!
                  </>
                )}
              </CardHolder>
              <Button title='Add Card' onClick={() => setAddCardOpen(true)} />
            </Col>
            <Col xs={{ span: 12, order: 3 }} sm={{ span: 4, order: 3 }}>
              <PartnerCol placeholder={PRTNR_2} setName={setpartner2Name}>
                {returnItemsForColumn(PRTNR_2).length > 0
                  ? returnItemsForColumn(PRTNR_2)
                  : 'Drag Cards Here!'}
              </PartnerCol>
            </Col>
          </Row>
        </Container>
      </DndProvider>
      <Modal
        open={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        title='Playing The Love Nest'
      >
        {inRound1 ? DIRECTIONS.ROUND_1 : DIRECTIONS.ROUND_2}
      </Modal>
      <Modal
        open={analysisOpen}
        onClose={() => setAnalysisOpen(false)}
        title='Analysis'
        submitBtn={
          <Button
            title='Re-sort'
            onClick={() => {
              setAnalysisOpen(false);
              setInRound1(false);
            }}
          />
        }
      >
        Based on your sort, it's likely...... {partner1Name || 'Partner 1'} is
        more overworked than {partner2Name || 'Partner 2'}
      </Modal>
      <Modal
        open={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        title='Add a Card'
        submitBtn={<Button title='Add' type='submit' form='addCard' />}
        error={addCardErr}
      >
        <form
          id='addCard'
          action='/'
          method='POST'
          onSubmit={handleAddCardSubmit}
        >
          Name:
          <StyledInput
            type='text'
            name='name'
            placeholder="Kid's school pick-up"
            align='left'
          />
          <br />
          Minutes spent on task per week:
          <StyledInput
            type='text'
            name='time'
            placeholder='40 mins'
            align='left'
          />
          <br />
          Is this task easily reschedulable?
          <input
            type='radio'
            name='isDailyGrind'
            value='N'
            style={{ accentColor: 'black' }}
          />
          <label for='N'> Yes </label>
          <input
            type='radio'
            name='isDailyGrind'
            value='Y'
            style={{ accentColor: 'black' }}
          />
          <label for='Y'> No</label>
        </form>
      </Modal>
    </div>
  );
}

export default Home;
