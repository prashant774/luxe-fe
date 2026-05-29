import styles from "./FilterSidebar.module.css";

function FilterSidebar({ title = "Filters", groups = [] }) {
  return (
    <aside className={styles.sidebar} aria-label={title}>
      <h3 className={styles.title}>{title}</h3>
      {groups.map((group) => (
        <section key={group.label} className={styles.group}>
          <h4 className={styles.groupTitle}>{group.label}</h4>
          <ul className={styles.list}>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}

export default FilterSidebar;
