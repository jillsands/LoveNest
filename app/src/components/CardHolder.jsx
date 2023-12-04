import { useDrop } from 'react-dnd';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';

const StyledCardHolder = styled(Col)`
  background: #2d6a4f;
  border-radius: 18px;
  color: white;
  margin: 8px 4px;
  padding: 0.5rem 0;
  min-height: 124px;
  ${({ isOver }) =>
    isOver &&
    `
    background: #52B788;
  `}
`;

function CardHolder({ styled = false, title, children }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'Card',
    drop: () => ({ name: title }),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
  });

  return styled ? (
    <StyledCardHolder isOver={isOver} ref={drop}>
      {children}
    </StyledCardHolder>
  ) : (
    <div isOver={isOver} ref={drop}>
      {children}
    </div>
  );
}
export default CardHolder;
