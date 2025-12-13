import PacmanLoader from 'react-spinners/PacmanLoader';
import style from './Loader.module.css';

export default function Loader() {
  return <div className={style.backdrop}>{<PacmanLoader />}</div>;
}
