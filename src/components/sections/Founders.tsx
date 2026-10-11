import styles from './Founders.module.css';

export function Founders() {
  return <div className={`${styles.founders} rv`}>
    <div className={styles['founders-k']}>Founded by people from</div>
    <img loading="lazy" decoding="async" src="/brand/founders/american-university-of-beirut.webp" width={327} height={109} alt="American University of Beirut" />
    <img loading="lazy" decoding="async" src="/brand/founders/university-of-toronto.webp" width={294} height={109} alt="University of Toronto" />
    <img loading="lazy" decoding="async" src="/brand/founders/uclouvain.webp" width={471} height={109} alt="UCLouvain" />
    <img loading="lazy" decoding="async" src="/brand/founders/boston-consulting-group.webp" width={519} height={109} alt="Boston Consulting Group" />
  </div>;
}
