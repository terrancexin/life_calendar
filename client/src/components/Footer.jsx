import React from 'react';

import '../styles/footer.css';

export default function Footer() {
  const icons = {
    globe: 'https://terrancexin.com',
    github: 'https://github.com/terrancexin/life_calendar',
    linkedin: 'https://www.linkedin.com/in/terrancexin/',
    angellist: 'https://angel.co/terrancexin',
  };

  return (
    <footer className="footer-icons">
      {Object.keys(icons).map((key) => {
        const link = icons[key];

        return (
          <a
            href={link}
            title={key}
            target="_blank"
            rel="noreferrer noopener"
            key={key}
          >
            {key !== 'globe' && <i className={`fab fa-${key}`} />}
            {key === 'globe' && <i className={`fa fa-${key}`} />}
          </a>
        );
      })}
    </footer>
  );
};
