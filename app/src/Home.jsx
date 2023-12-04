import React, { useCallback, useState } from 'react';

import update from 'immutability-helper';

import styled from 'styled-components';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { PDFDownloadLink } from '@react-pdf/renderer';

import Button from './components/Button';
import TaskCard from './components/TaskCard';
import PartnerCol from './components/PartnerCol';
import CardHolder from './components/CardHolder';
import Modal from './components/Modal';
import ResultsPDF from './components/ResultsPDF';
import AddCardForm from './components/AddCardForm';

import { COLUMN_NAMES } from './constants';
import { tasks } from './tasks';

const StyledHeader = styled.h2`
  color: #2d6a4f;
  font-size: 36px;
  margin: 24px;
  margin-top: 48px;
  font-weight: 800;
`;

const StyledListContainer = styled.div`
  text-align: left;
  display: flex;
  justify-content: center;
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

  const moveCardHandler = useCallback((dragItemName, hoverItemName) => {
    console.log(dragItemName, hoverItemName);
    setItems((prevState) => {
      const dragIndex = prevState.findIndex(
        (item) => item.name === dragItemName
      );
      const hoverIndex = prevState.findIndex(
        (item) => item.name === hoverItemName
      );

      return update(prevState, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevState[dragIndex]],
        ],
      });
    });
  }, []);

  const renderTasksForColumn = (columnName) =>
    items
      .filter((item) => item.column === columnName)
      .map((item, index) => (
        <TaskCard
          key={item.name}
          item={item}
          inRound1={inRound1}
          setItems={setItems}
          index={index}
          moveCardHandler={moveCardHandler}
        />
      ));

  const unsortCards = () => {
    setItems(
      items.map((item) => ({
        ...item,
        column: UNSORTED,
      }))
    );
  };

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const includes = e.target[1].value;

    if (name && (e.target[2].checked || e.target[3].checked)) {
      const isDaily = e.target[2].checked ? true : false;
      setItems([...items, { name, includes, isDaily, column: UNSORTED }]);
      setAddCardOpen(false);
      setAddCardErr(false);
      return;
    }
    setAddCardErr(true);
  };

  const renderDirections1ModalContent = () => (
    <Container className='text-center'>
      <h4> Round 1 </h4>
      <Row>
        <p>
          Enter your names and begin sorting each card based on which partner
          currently performs the <strong> mental labor </strong> that is
          required for a task, that is:
        </p>
        <StyledListContainer>
          <ul>
            <li> knowing/remembering/storing information </li>
            <li>planning/reminding/decision-making </li>
            <li> supervising/keeping track of completion</li>
          </ul>
        </StyledListContainer>
        (Reich-Stiebert et al.)
        <br />
        At this stage, consider your “Why” in doing each task. How does this
        task contribute to your- not anyone else’s- values? When you think about
        it this way, is it still important? If not, delete it. You can also
        choose to add tasks, but be sure to leave no card unsorted!
      </Row>
    </Container>
  );

  const renderDirections2ModalContent = () => (
    <Container className='text-center'>
      <h4> Round 2 </h4>
      <Row>
        <p>
          Assign a partner to "own" each card. This means they will handle the
          <strong> mental load and execution </strong> of the task without
          reminders, rewards, or excuses. When assigning, consider your shared
          values, and
          <strong>
            {' '}
            agree on a set of standards for each stage of the task{' '}
          </strong>
          that the owner will stick to.
        </p>
        <StyledListContainer>
          <ul>
            <li>
              If neither of you likes doing a particular task, flip a coin. You
              can always change the owner from week to week.
            </li>
            <li>
              Avoid trying to share a task- this will lead to duplicated mental
              load and sometimes, accidental duplicated execution.
            </li>
            <li>
              Make sure you divide the unreschedulable tasks (marked with a
              clock) based on capabilities and availabilities, even if one
              partner is “busier.”
            </li>
            <li>
              Don’t worry about getting exactly equal, but focus on a fair
              split.
            </li>
            <li>
              Once you’ve decided, stick to it for about a week, and then share
              feedback and consider making changes.
            </li>
          </ul>
        </StyledListContainer>
        <p> (Rodsky) </p>
      </Row>
    </Container>
  );

  const renderAnalysisModalContent = () => {
    const name1 = partner1Name || 'Partner 1';
    const name2 = partner2Name || 'Partner 2';

    const p1DailyCount = items.filter(
      (item) => item.column === PRTNR_1 && item.isDaily
    ).length;
    const p1TotalCount = items.filter((item) => item.column === PRTNR_1).length;

    const p2DailyCount = items.filter(
      (item) => item.column === PRTNR_2 && item.isDaily
    ).length;
    const p2TotalCount = items.filter((item) => item.column === PRTNR_2).length;

    return (
      <Container className='text-center'>
        <Row>
          <h5> Based on your selection, it seems...</h5>
          <StyledListContainer>
            <ul>
              <li>
                {p1TotalCount === p2TotalCount
                  ? 'Each partner performs the mental labor for the same number of tasks! You may still want to continue the game to further encourage a fair split in your relationship. '
                  : (p1TotalCount > p2TotalCount ? name1 : name2) +
                    ' takes on the mental load for the majority of tasks'}
              </li>
              <li>
                {p1DailyCount === p2DailyCount
                  ? 'Each partner performs the mental labor for the same number of daily/unreschedulable tasks! You may still want to continue the game to further encourage a fair split in your relationship. '
                  : (p1DailyCount > p2DailyCount ? name1 : name2) +
                    ' takes on the mental load for the majority of daily/unreschedulable tasks'}
              </li>
            </ul>
          </StyledListContainer>
          <h5> Fixing an unjust division of labor can lead to... </h5>
          <StyledListContainer>
            <ul>
              <li>A happier relationship with less nagging and resentment</li>
              <li>
                More time for each partner to focus on their passions and
                self-care
              </li>
              <li>
                Better performance at work and an increased ability to take on
                new projects or positions
              </li>
              <li>Being a more present and active friend and family member </li>
            </ul>
          </StyledListContainer>
          (Reich-Stiebert et al.; Rodsky; Saraswati et al.)
          <br />
          Now we'll work towards valuing each partner's time equally, no matter
          your outside responsibilities. For the less-burdened partner, you will
          be asked to take on more. For the load-bearing partner, you will be
          asked to hand some control to your partner and trust in their
          abilities.
        </Row>
      </Container>
    );
  };

  return (
    <div className='Home'>
      <Container>
        <Row className='justify-content-center'>
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
              {renderTasksForColumn(PRTNR_1).length > 0
                ? renderTasksForColumn(PRTNR_1)
                : 'Drag Cards Here!'}
            </PartnerCol>
          </Col>
          <Col
            className='justify-content-center'
            xs={{ span: 12, order: 1 }}
            sm={{ span: 4, order: 2 }}
          >
            <Row className='justify-content-center mt-3'>
              <h4> Cards </h4>
            </Row>
            <CardHolder title={UNSORTED}>
              {renderTasksForColumn(UNSORTED).length > 0 ? (
                renderTasksForColumn(UNSORTED)
              ) : inRound1 ? (
                <>
                  You've sorted all the cards!
                  <br />
                  <Button
                    title='Next Step'
                    onClick={() => setAnalysisOpen(true)}
                  />
                </>
              ) : (
                <>
                  Happy with your sort? <br />
                  Try out your current selection for a week! Ideally, try to
                  have a weekly check-in where you can share feedback. Remember,
                  task ownership can- and should, in the more demanding cases-
                  be changed from week to week!
                  {items && (
                    <PDFDownloadLink
                      document={
                        <ResultsPDF
                          name1={partner1Name || 'Partner 1'}
                          name2={partner2Name || 'Partner 2'}
                          tasks={items}
                        />
                      }
                      fileName='LoveNest.pdf'
                    >
                      {({ loading, error }) =>
                        !(loading || error) && <Button title='Download Tasks' />
                      }
                    </PDFDownloadLink>
                  )}
                </>
              )}
            </CardHolder>
            <Button title='Add Card' onClick={() => setAddCardOpen(true)} />
          </Col>
          <Col xs={{ span: 12, order: 3 }} sm={{ span: 4, order: 3 }}>
            <PartnerCol placeholder={PRTNR_2} setName={setpartner2Name}>
              {renderTasksForColumn(PRTNR_2).length > 0
                ? renderTasksForColumn(PRTNR_2)
                : 'Drag Cards Here!'}
            </PartnerCol>
          </Col>
        </Row>
        <Row>
          <a
            href='https://docs.google.com/document/d/1rYS0hywxFhvu1NPiwnh66HzGs4yFUnLa7sfMeA6hcMw/edit?usp=sharing'
            target='_blank'
            rel='noreferrer'
            style={{ color: '#2d6a4f' }}
          >
            Sources
          </a>
        </Row>
      </Container>
      <Modal
        open={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        title='Playing The Love Nest'
      >
        {inRound1
          ? renderDirections1ModalContent()
          : renderDirections2ModalContent()}
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
              setDirectionsOpen(true);
              unsortCards();
            }}
          />
        }
      >
        {renderAnalysisModalContent()}
      </Modal>
      <Modal
        open={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        title='Add a Card'
        submitBtn={<Button title='Add' type='submit' form='addCard' />}
      >
        <AddCardForm onSubmit={handleAddCardSubmit} error={addCardErr} />
      </Modal>
    </div>
  );
}

export default Home;
