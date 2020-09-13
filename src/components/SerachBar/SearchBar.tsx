import * as React from "react";

import styles from "./SearchBar.module.scss";

const searchBar = () => (
  <div className={styles.search_section}>
    <div className={styles.search_wrap}>
      <div className={styles.filledSpanR1} />
      <div className={styles.filledSpanR2} />
      <div className={styles.filledSpanR3} />
      <div className={styles.search_group}>
        <input
          type="text"
          className={styles.search_input}
          placeholder="Search"
        />
        <button className={styles.inner_button} type="button">
          <div className={styles.search_after}>
            <span className={styles.img_span_wrap}>
              <svg viewBox="0 0 16 16">
                <path d="M15.718,15.718 C15.327,16.108 14.694,16.108 14.303,15.718 L11.154,12.568 C8.412,14.618 4.524,14.424 2.033,11.932 C-0.701,9.198 -0.701,4.766 2.033,2.033 C4.766,-0.701 9.198,-0.701 11.932,2.033 C14.424,4.524 14.618,8.412 12.568,11.154 L15.718,14.303 C16.108,14.694 16.108,15.327 15.718,15.718 ZM10.518,3.447 C8.565,1.494 5.399,1.494 3.447,3.447 C1.494,5.399 1.494,8.565 3.447,10.518 C5.399,12.470 8.565,12.470 10.518,10.518 C12.470,8.565 12.470,5.399 10.518,3.447 Z" />
              </svg>
            </span>
          </div>
        </button>
      </div>
      <div className={styles.filledSpanR3} />
      <div className={styles.filledSpanR2} />
      <div className={styles.filledSpanR1} />
    </div>
  </div>
);

export default searchBar;
