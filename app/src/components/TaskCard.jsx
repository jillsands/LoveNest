import React, { useRef } from 'react';
import styled from 'styled-components';

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tooltip, tooltipClasses } from '@mui/material';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useDrag, useDrop } from 'react-dnd';

import { COLUMN_NAMES } from '../constants';

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
    filter: brightness(0.95);
  }

  ${({ isDragging }) =>
    isDragging &&
    `
  background: white;
  ;
`}
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

function TaskCard({ item, index, moveCardHandler, setItems }) {
  const { time, name, currentColumnName } = item;
  const ref = useRef(null);

  const handleDeleteItem = () => {
    setItems((prevState) => prevState.filter((i) => i.name !== item.name));
  };
  const changeItemColumn = (currentItem, columnName) => {
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
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
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
      // Time to actually perform the action
      moveCardHandler(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Card',
    item: { index, name, currentColumnName, type: 'Card' },
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

  drag(drop(ref));

  return (
    <Card ref={ref} isDragging={isDragging}>
      <div>
        <StyledTooltip
          title={
            <React.Fragment>
              The less tasks, the less work for you and your partner! Consider
              removing some tasks if <strong> both partners </strong> agree that
              they do not serve the relationship. If a task is only important to
              one partner, that partner will own it.
            </React.Fragment>
          }
          sx={{ position: 'absolute', top: 4, right: 4 }}
        >
          <IconButton size='small' onClick={handleDeleteItem}>
            <CloseIcon sx={{ fontSize: 14, padding: 0 }} />
          </IconButton>
        </StyledTooltip>
        {name}
      </div>
    </Card>
  );
}

export default TaskCard;
