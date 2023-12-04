import React, { useRef } from 'react';

import styled from 'styled-components';

import CloseIcon from '@mui/icons-material/Close';
import TimerIcon from '@mui/icons-material/Timer';
import { IconButton, Tooltip, tooltipClasses } from '@mui/material';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useDrag, useDrop } from 'react-dnd';

import { COLUMN_NAMES } from '../constants';

const StyledTextArea = styled.textarea`
  border-radius: 12px;
  font-size: 14px;

  &:focus {
    outline: none;
    border: 2px solid #2d6a4f;
  }
`;

const Card = styled.div`
  flex-direction: column;
  background: #d8f3dc;
  border-radius: 18px;
  color: #081c15;
  padding: 0.5rem 0;
  transition: all 200ms ease-in-out;
  display: flex;
  margin: 6px;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background: #c3dcc7;
  }

  ${({ isDragging }) =>
    isDragging &&
    `
    background: #c3dcc7;
  ;
`}
`;

const Title = styled(Col)`
  padding: 0 22px;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const Subtitle = styled.p`
  color: #2d6a4f;
  font-size: 13px;
  margin-bottom: 0;
  padding: 0 8px;
`;

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#081c15',
    color: '#f8fdf9',
    fontSize: 13,
  },
}));

function TaskCard({ item, index, inRound1, moveCardHandler, setItems }) {
  const { name, includes, isDaily, standards, column } = item;
  
  const cardRef = useRef(null);

  const handleDeleteItem = () => {
    setItems((prevState) => prevState.filter((i) => i.name !== name));
  };

  const handleAddStandards = (e) => {
    setItems((prevState) =>
      prevState.map((i) =>
        i.name === name ? { ...i, standards: e.target.value } : i
      )
    );
  };

  const changeItemColumn = (currentItem, columnName) => {
    if (currentItem.column === columnName) {
      return;
    }

    setItems((prevState) => {
      return prevState.map((e) => {
        return {
          ...e,
          column: e.name === currentItem.name ? columnName : e.column,
        };
      });
    });
  };

  const [, drop] = useDrop({
    accept: 'Card',
    hover(dragItem, monitor) {
      if (!cardRef.current) {
        return;
      }
      const dragIndex = dragItem.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex || dragItem.name === name) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = cardRef.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCardHandler(dragItem.name, item.name);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Card',
    item: { name, standards, includes, column },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        const { name } = dropResult;
        const { PRTNR_1, UNSORTED, PRTNR_2 } = COLUMN_NAMES;

        switch (name) {
          case PRTNR_1:
            changeItemColumn(item, PRTNR_1);
            break;
          case UNSORTED:
            changeItemColumn(item, UNSORTED);
            break;
          case PRTNR_2:
            changeItemColumn(item, PRTNR_2);
            break;
          default:
            break;
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(cardRef));

  return (
    <Card ref={cardRef} isDragging={isDragging}>
      <StyledTooltip
        title={
          <React.Fragment>
            If <strong> both partners </strong> agree that a task does not serve
            the goals of the relationship, delete it. If that goal is only
            important to one partner (spirituality, etc.), that partner will own
            it.
          </React.Fragment>
        }
        sx={{ position: 'absolute', top: 4, right: 4 }}
      >
        <IconButton size='small' onClick={handleDeleteItem}>
          <CloseIcon sx={{ fontSize: 14, padding: 0 }} />
        </IconButton>
      </StyledTooltip>

      <Container className='text-center'>
        <Row className='justify-content-center align-items-center'>
          <Title>
            {name} &nbsp;
            {isDaily && (
              <StyledTooltip
                title='This task is performed often and/or is difficult to
                    reschedule.'
                sx={{ position: 'absolute', top: 4, right: 4 }}
              >
                <TimerIcon sx={{ fontSize: 14, padding: 0 }} />
              </StyledTooltip>
            )}
          </Title>
        </Row>
        <Row className='justify-content-center' style={{ margin: '0px 2px' }}>
          <Subtitle> {includes} </Subtitle>
          {!inRound1 && (
            <StyledTextArea
              placeholder='Add standards here'
              onChange={handleAddStandards}
              onDragOver={(evt) => evt.stopPropagation()}
              value={standards && standards}
            />
          )}
        </Row>
      </Container>
    </Card>
  );
}

export default TaskCard;
