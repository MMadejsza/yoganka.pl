import { protectWordBreaks } from '../../utils/validation.js';

function Motto({ content }) {
  return (
    <div className={`motto`}>
      <h3>{protectWordBreaks(content)}</h3>
    </div>
  );
}

export default Motto;
