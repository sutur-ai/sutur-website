import styles from './Founders.module.css';

export function Founders() {
  return <div className={`${styles.founders} rv`}>
    <div className={styles['founders-k']}>Founded by people from</div>
    <img src="/brand/founders/american-university-of-beirut.png" width={300} height={100} alt="American University of Beirut" />
    <img src="/brand/founders/university-of-toronto.svg" width={428.5} height={159} alt="University of Toronto" />
    <img src="/brand/founders/uclouvain.png" width={1239} height={287} alt="UCLouvain" />
    <img src="/brand/founders/boston-consulting-group.png" width={629} height={132} alt="Boston Consulting Group" />
  </div>;
}
