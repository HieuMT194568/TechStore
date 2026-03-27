import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="app-footer">
      <Container>
        <p>
          ⚡ <strong>TechStore</strong> — Cửa hàng Thiết bị Công nghệ
          &nbsp;·&nbsp; © {new Date().getFullYear()} All rights reserved.
        </p>
        <p style={{ marginTop: '4px', opacity: 0.5 }}>
          Built with ReactJS · React Router v6 · React Bootstrap · json-server
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
